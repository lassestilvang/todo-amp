import { NextRequest, NextResponse } from 'next/server';
import db, { Task } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const listId = request.nextUrl.searchParams.get('listId');

    let query = 'SELECT * FROM tasks';
    const params: string[] = [];

    if (listId) {
      query += ' WHERE listId = ?';
      params.push(listId);
    }

    query += ' ORDER BY createdAt DESC';

    const tasks = db.prepare(query).all(...params) as Task[];
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      listId,
      name,
      description,
      date,
      deadline,
      priority,
      estimatedTime,
      actualTime,
    } = body;

    if (!listId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const now = Date.now();

    db.prepare(
      `INSERT INTO tasks (
        id, listId, name, description, date, deadline, priority,
        estimatedTime, actualTime, completed, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      listId,
      name,
      description || '',
      date || null,
      deadline || null,
      priority || 'none',
      estimatedTime || '',
      actualTime || '',
      0,
      now,
      now
    );

    // Log task creation
    const logId = uuidv4();
    db.prepare(
      'INSERT INTO task_logs (id, taskId, action, changes, createdAt) VALUES (?, ?, ?, ?, ?)'
    ).run(logId, id, 'created', JSON.stringify(body), now);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task;
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

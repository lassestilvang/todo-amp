import { NextRequest, NextResponse } from 'next/server';
import db, { Subtask } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const taskId = request.nextUrl.searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    if (taskId === 'all') {
      const subtasks = db
        .prepare('SELECT * FROM subtasks ORDER BY createdAt ASC')
        .all() as Subtask[];
      return NextResponse.json(subtasks);
    }

    const subtasks = db
      .prepare('SELECT * FROM subtasks WHERE taskId = ? ORDER BY createdAt ASC')
      .all(taskId) as Subtask[];

    return NextResponse.json(subtasks);
  } catch (error) {
    console.error('Error fetching subtasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subtasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, name } = body;

    if (!taskId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const now = Date.now();

    db.prepare(
      'INSERT INTO subtasks (id, taskId, name, completed, createdAt) VALUES (?, ?, ?, ?, ?)'
    ).run(id, taskId, name, 0, now);

    const subtask = db
      .prepare('SELECT * FROM subtasks WHERE id = ?')
      .get(id) as Subtask;
    return NextResponse.json(subtask, { status: 201 });
  } catch (error) {
    console.error('Error creating subtask:', error);
    return NextResponse.json(
      { error: 'Failed to create subtask' },
      { status: 500 }
    );
  }
}

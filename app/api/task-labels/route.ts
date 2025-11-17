import { NextRequest, NextResponse } from 'next/server';
import db, { TaskLabel } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const taskId = request.nextUrl.searchParams.get('taskId');

    let query = 'SELECT * FROM task_labels';
    const params: string[] = [];

    if (taskId) {
      query += ' WHERE taskId = ?';
      params.push(taskId);
    }

    const taskLabels = db.prepare(query).all(...params) as TaskLabel[];
    return NextResponse.json(taskLabels);
  } catch (error) {
    console.error('Error fetching task labels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task labels' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, labelId } = body;

    if (!taskId || !labelId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if association already exists
    const existing = db
      .prepare('SELECT * FROM task_labels WHERE taskId = ? AND labelId = ?')
      .get(taskId, labelId);

    if (existing) {
      return NextResponse.json(existing);
    }

    db.prepare('INSERT INTO task_labels (taskId, labelId) VALUES (?, ?)').run(
      taskId,
      labelId
    );

    const taskLabel = db
      .prepare('SELECT * FROM task_labels WHERE taskId = ? AND labelId = ?')
      .get(taskId, labelId) as TaskLabel;

    return NextResponse.json(taskLabel, { status: 201 });
  } catch (error) {
    console.error('Error creating task label:', error);
    return NextResponse.json(
      { error: 'Failed to create task label' },
      { status: 500 }
    );
  }
}

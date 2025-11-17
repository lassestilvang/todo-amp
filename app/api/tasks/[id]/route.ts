import { NextRequest, NextResponse } from 'next/server';
import db, { Task } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params;
  try {
    const task = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(resolvedParams.id) as Task | undefined;

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const {
      name,
      description,
      date,
      deadline,
      priority,
      estimatedTime,
      actualTime,
      completed,
    } = body;

    const now = Date.now();
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (date !== undefined) {
      updates.push('date = ?');
      values.push(date);
    }
    if (deadline !== undefined) {
      updates.push('deadline = ?');
      values.push(deadline);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }
    if (estimatedTime !== undefined) {
      updates.push('estimatedTime = ?');
      values.push(estimatedTime);
    }
    if (actualTime !== undefined) {
      updates.push('actualTime = ?');
      values.push(actualTime);
    }
    if (completed !== undefined) {
      updates.push('completed = ?');
      values.push(completed ? 1 : 0);
      updates.push('completedAt = ?');
      values.push(completed ? now : null);
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(resolvedParams.id);

    db.prepare(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`
    ).run(...values);

    // Log task update
    const logId = uuidv4();
    db.prepare(
      'INSERT INTO task_logs (id, taskId, action, changes, createdAt) VALUES (?, ?, ?, ?, ?)'
    ).run(logId, resolvedParams.id, 'updated', JSON.stringify(body), now);

    const task = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(resolvedParams.id) as Task;
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params;
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

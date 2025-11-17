import { NextRequest, NextResponse } from 'next/server';
import db, { Subtask } from '@/lib/db';

interface Params {
  id: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const { name, completed } = body;

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }

    if (completed !== undefined) {
      updates.push('completed = ?');
      values.push(completed ? 1 : 0);
      updates.push('completedAt = ?');
      values.push(completed ? Date.now() : null);
    }

    values.push(resolvedParams.id);

    db.prepare(
      `UPDATE subtasks SET ${updates.join(', ')} WHERE id = ?`
    ).run(...values);

    const subtask = db
      .prepare('SELECT * FROM subtasks WHERE id = ?')
      .get(resolvedParams.id) as Subtask;
    return NextResponse.json(subtask);
  } catch (error) {
    console.error('Error updating subtask:', error);
    return NextResponse.json(
      { error: 'Failed to update subtask' },
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
    db.prepare('DELETE FROM subtasks WHERE id = ?').run(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    return NextResponse.json(
      { error: 'Failed to delete subtask' },
      { status: 500 }
    );
  }
}

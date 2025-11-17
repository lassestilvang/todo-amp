import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; labelId: string }> }
) {
  try {
    const { taskId, labelId } = await params;

    if (!taskId || !labelId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    db.prepare('DELETE FROM task_labels WHERE taskId = ? AND labelId = ?').run(
      taskId,
      labelId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task label:', error);
    return NextResponse.json(
      { error: 'Failed to delete task label' },
      { status: 500 }
    );
  }
}

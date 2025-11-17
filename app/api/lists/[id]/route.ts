import { NextRequest, NextResponse } from 'next/server';
import db, { List } from '@/lib/db';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params;
  try {
    const list = db
      .prepare('SELECT * FROM lists WHERE id = ?')
      .get(resolvedParams.id) as List | undefined;

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch list' },
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
    const { name, color, emoji } = body;

    const now = Date.now();
    db.prepare(
      'UPDATE lists SET name = COALESCE(?, name), color = COALESCE(?, color), emoji = COALESCE(?, emoji), updatedAt = ? WHERE id = ?'
    ).run(name || null, color || null, emoji || null, now, resolvedParams.id);

    const list = db
      .prepare('SELECT * FROM lists WHERE id = ?')
      .get(resolvedParams.id) as List;
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json(
      { error: 'Failed to update list' },
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
    // Don't allow deleting the inbox
    const list = db
      .prepare('SELECT isDefault FROM lists WHERE id = ?')
      .get(resolvedParams.id) as { isDefault: number } | undefined;

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    if (list.isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete the inbox list' },
        { status: 400 }
      );
    }

    db.prepare('DELETE FROM lists WHERE id = ?').run(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting list:', error);
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    );
  }
}

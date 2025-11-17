import { NextRequest, NextResponse } from 'next/server';
import db, { List } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const lists = db
      .prepare('SELECT * FROM lists ORDER BY createdAt ASC')
      .all() as List[];
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, emoji } = body;

    if (!name || !color || !emoji) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const now = Date.now();

    db.prepare(
      'INSERT INTO lists (id, name, color, emoji, isDefault, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, name, color, emoji, 0, now, now);

    const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(id) as List;
    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    );
  }
}

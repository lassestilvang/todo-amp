import { NextRequest, NextResponse } from 'next/server';
import db, { Label } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const labels = db
      .prepare('SELECT * FROM labels ORDER BY name ASC')
      .all() as Label[];
    return NextResponse.json(labels);
  } catch (error) {
    console.error('Error fetching labels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch labels' },
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
      'INSERT INTO labels (id, name, color, emoji, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, name, color, emoji, now, now);

    const label = db
      .prepare('SELECT * FROM labels WHERE id = ?')
      .get(id) as Label;
    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error('Error creating label:', error);
    return NextResponse.json(
      { error: 'Failed to create label' },
      { status: 500 }
    );
  }
}

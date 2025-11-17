import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export interface List {
  id: string;
  name: string;
  color: string;
  emoji: string;
  createdAt: number;
  updatedAt: number;
  isDefault: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  emoji: string;
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string;
  listId: string;
  name: string;
  description: string;
  date: number | null;
  deadline: number | null;
  priority: 'high' | 'medium' | 'low' | 'none';
  estimatedTime: string;
  actualTime: string;
  completed: boolean;
  completedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface Subtask {
  id: string;
  taskId: string;
  name: string;
  completed: boolean;
  completedAt: number | null;
  createdAt: number;
}

export interface TaskLabel {
  taskId: string;
  labelId: string;
}

export interface Reminder {
  id: string;
  taskId: string;
  type: 'notification' | 'email';
  minutesBefore: number;
  createdAt: number;
}

export interface Attachment {
  id: string;
  taskId: string;
  name: string;
  url: string;
  createdAt: number;
}

export interface TaskLog {
  id: string;
  taskId: string;
  action: string;
  changes: string;
  createdAt: number;
}

export interface TaskRecurrence {
  id: string;
  taskId: string;
  type: 'daily' | 'weekly' | 'weekday' | 'monthly' | 'yearly' | 'custom';
  customRule?: string;
  endDate?: number;
  createdAt: number;
}

// Initialize database schema
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS lists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      emoji TEXT NOT NULL,
      isDefault INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS labels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      emoji TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      listId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      date INTEGER,
      deadline INTEGER,
      priority TEXT DEFAULT 'none',
      estimatedTime TEXT DEFAULT '',
      actualTime TEXT DEFAULT '',
      completed INTEGER DEFAULT 0,
      completedAt INTEGER,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (listId) REFERENCES lists(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subtasks (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      name TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completedAt INTEGER,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS task_labels (
      taskId TEXT NOT NULL,
      labelId TEXT NOT NULL,
      PRIMARY KEY (taskId, labelId),
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (labelId) REFERENCES labels(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      type TEXT NOT NULL,
      minutesBefore INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS task_logs (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      action TEXT NOT NULL,
      changes TEXT,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS task_recurrence (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      type TEXT NOT NULL,
      customRule TEXT,
      endDate INTEGER,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
    CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
    CREATE INDEX IF NOT EXISTS idx_tasks_listId ON tasks(listId);
    CREATE INDEX IF NOT EXISTS idx_subtasks_taskId ON subtasks(taskId);
    CREATE INDEX IF NOT EXISTS idx_task_labels_taskId ON task_labels(taskId);
    CREATE INDEX IF NOT EXISTS idx_task_labels_labelId ON task_labels(labelId);
  `);

  // Create default inbox list if it doesn't exist
  const inboxExists = db
    .prepare('SELECT id FROM lists WHERE isDefault = 1')
    .get();
  if (!inboxExists) {
    const id = uuidv4();
    const now = Date.now();
    db.prepare(
      'INSERT INTO lists (id, name, color, emoji, isDefault, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, 'Inbox', '#3B82F6', '📥', 1, now, now);
  }
}

initializeDatabase();

export default db;

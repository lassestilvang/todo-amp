'use client';

import { Sidebar } from '@/components/sidebar';
import { TaskList } from '@/components/task-list';

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <TaskList />
    </div>
  );
}

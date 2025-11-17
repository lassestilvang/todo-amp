'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Task } from '@/lib/db';
import { TaskItem } from './task-item';
import { TaskDialog } from './dialogs/task-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Fuse from 'fuse.js';
import { motion } from 'framer-motion';

export function TaskList() {
  const {
    tasks,
    lists,
    labels,
    currentView,
    selectedListId,
    selectedLabelId,
    showCompleted,
    searchQuery,
    setSearchQuery,
    taskLabels,
  } = useStore();

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showCreateTask, setShowCreateTask] = useState(false);

  useEffect(() => {
    const getViewTasks = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();

      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(23, 59, 59, 999);
      const nextWeekTime = nextWeek.getTime();

      let filtered = tasks;

      // If a label is selected, filter by label only (takes priority over views and lists)
      if (selectedLabelId) {
        const tasksWithLabel = new Set(
          taskLabels
            .filter((tl) => tl.labelId === selectedLabelId)
            .map((tl) => tl.taskId)
        );
        filtered = filtered.filter((t) => tasksWithLabel.has(t.id));
      } else if (selectedListId) {
        // If a list is selected (and no label), filter by list only
        filtered = filtered.filter((t) => t.listId === selectedListId);
      } else {
        // Otherwise apply view filter (today, next7days, upcoming, or all)
        switch (currentView) {
          case 'today':
            filtered = filtered.filter(
              (t) =>
                t.date &&
                t.date >= todayTime &&
                t.date < todayTime + 86400000
            );
            break;
          case 'next7days':
            filtered = filtered.filter(
              (t) => t.date && t.date >= todayTime && t.date <= nextWeekTime
            );
            break;
          case 'upcoming':
            filtered = filtered.filter((t) => t.date && t.date >= todayTime);
            break;
          case 'all':
            // No view filter, include all
            break;
        }
      }

      // Apply completion filter
      if (!showCompleted) {
        filtered = filtered.filter((t) => !t.completed);
      }

      return filtered;
    };

    let finalTasks = getViewTasks();

    // Apply search
    if (searchQuery.trim()) {
      const fuse = new Fuse(finalTasks, {
        keys: ['name', 'description'],
        threshold: 0.3,
      });
      finalTasks = fuse.search(searchQuery).map((result) => result.item);
    }

    setFilteredTasks(finalTasks);
  }, [tasks, currentView, selectedListId, selectedLabelId, showCompleted, searchQuery, taskLabels]);

  const getListName = () => {
    if (selectedLabelId) {
      // Show label name if one is selected
      const label = labels.find((l) => l.id === selectedLabelId);
      return label ? `${label.emoji} ${label.name}` : 'Tasks';
    }
    if (selectedListId && currentView === 'all') {
      return lists.find((l) => l.id === selectedListId)?.name || 'Tasks';
    }
    return currentView.charAt(0).toUpperCase() + currentView.slice(1);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">
            {getListName()}
          </h2>
          <Button onClick={() => setShowCreateTask(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground text-lg mb-4">
              {searchQuery
                ? 'No tasks found matching your search'
                : 'No tasks yet'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateTask(true)} variant="outline">
                Create your first task
              </Button>
            )}
          </div>
        ) : (
          <motion.div className="space-y-2">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskItem task={task} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Create Task Dialog */}
      <TaskDialog open={showCreateTask} onOpenChange={setShowCreateTask} />
    </div>
  );
}

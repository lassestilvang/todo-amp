'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Task } from '@/lib/db';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TaskDetailDialog } from './dialogs/task-detail-dialog';
import { toast } from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { deleteTask, toggleTaskCompletion } = useStore();
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = async () => {
    toggleTaskCompletion(task.id);

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });
    } catch {
      toast.error('Failed to update task');
      toggleTaskCompletion(task.id);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    deleteTask(task.id);

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const isOverdue =
    task.deadline &&
    !task.completed &&
    task.deadline < Date.now();

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return '';
    }
  };

  return (
    <>
      <motion.div
        layout
        className={cn(
          'p-4 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer group',
          isOverdue && 'border-red-500 bg-red-50 dark:bg-red-950',
          task.completed && 'opacity-60 bg-muted'
        )}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggle}
            className="mt-1"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={cn(
                  'text-sm font-medium truncate',
                  task.completed && 'line-through text-muted-foreground'
                )}
              >
                {task.name}
              </h3>
              {task.priority !== 'none' && (
                <Badge variant="outline" className={cn('text-xs', getPriorityColor())}>
                  {task.priority}
                </Badge>
              )}
            </div>

            {task.description && (
              <p className="text-xs text-muted-foreground mb-2 truncate">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {task.date && (
                <div className={cn(
                  'flex items-center gap-1 text-xs',
                  isOverdue
                    ? 'text-red-600 dark:text-red-400 font-semibold'
                    : 'text-muted-foreground'
                )}>
                  <Calendar className="w-3 h-3" />
                  {format(task.date, 'MMM d')}
                </div>
              )}
              {task.estimatedTime && (
                <Badge variant="secondary" className="text-xs">
                  {task.estimatedTime}
                </Badge>
              )}
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <TaskDetailDialog
        task={task}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}

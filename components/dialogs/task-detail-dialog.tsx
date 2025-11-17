'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Task, Subtask } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface TaskDetailDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailDialogProps) {
  const { updateTask, subtasks, addSubtask, deleteSubtask, toggleSubtaskCompletion } = useStore();
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [newSubtask, setNewSubtask] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(task.name);
    setDescription(task.description);
    setPriority(task.priority);
  }, [task]);

  const taskSubtasks = subtasks.filter((s) => s.taskId === task.id);

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSubtask.trim()) {
      toast.error('Subtask name is required');
      return;
    }

    try {
      const response = await fetch('/api/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          name: newSubtask,
        }),
      });

      if (!response.ok) throw new Error('Failed to create subtask');

      const subtask = await response.json();
      addSubtask(subtask);
      setNewSubtask('');
      toast.success('Subtask added');
    } catch {
      toast.error('Failed to add subtask');
    }
  };

  const handleToggleSubtask = async (subtask: Subtask) => {
    toggleSubtaskCompletion(subtask.id);

    try {
      await fetch(`/api/subtasks/${subtask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !subtask.completed,
        }),
      });
    } catch {
      toast.error('Failed to update subtask');
      toggleSubtaskCompletion(subtask.id);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    deleteSubtask(subtaskId);

    try {
      await fetch(`/api/subtasks/${subtaskId}`, {
        method: 'DELETE',
      });
    } catch {
      toast.error('Failed to delete subtask');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          priority,
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      updateTask(task.id, {
        name,
        description,
        priority,
      });

      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Task name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as 'high' | 'medium' | 'low' | 'none'
                )
              }
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            >
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Task Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            {task.date && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  Date
                </label>
                <p className="text-sm">{format(task.date, 'PPP')}</p>
              </div>
            )}
            {task.estimatedTime && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  Est. Time
                </label>
                <p className="text-sm">{task.estimatedTime}</p>
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Subtasks</label>
              <Badge variant="secondary">
                {taskSubtasks.filter((s) => s.completed).length}/{taskSubtasks.length}
              </Badge>
            </div>

            {taskSubtasks.length > 0 && (
              <div className="space-y-2 mb-3">
                {taskSubtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-accent/50"
                  >
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => handleToggleSubtask(subtask)}
                    />
                    <span
                      className={
                        subtask.completed
                          ? 'line-through text-muted-foreground text-sm'
                          : 'text-sm'
                      }
                    >
                      {subtask.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto h-6 w-6"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <Input
                placeholder="Add subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="text-sm"
              />
              <Button type="submit" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

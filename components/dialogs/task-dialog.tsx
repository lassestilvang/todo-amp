'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Task } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface TaskDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDialog({ task, open, onOpenChange }: TaskDialogProps) {
  const {
    updateTask,
    addTask,
    lists,
    labels,
    subtasks,
    taskLabels,
    addSubtask,
    deleteSubtask,
    toggleSubtaskCompletion,
    addTaskLabel,
    deleteTaskLabel,
  } = useStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [listId, setListId] = useState('');
  const [date, setDate] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low' | 'none'>('none');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [actualTime, setActualTime] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setListId(task.listId);
      setDate(task.date);
      setDeadline(task.deadline);
      setPriority(task.priority);
      setEstimatedTime(task.estimatedTime);
      setActualTime(task.actualTime);
      // Load labels associated with this task
      const taskLabelIds = taskLabels
        .filter((tl) => tl.taskId === task.id)
        .map((tl) => tl.labelId);
      setSelectedLabels(taskLabelIds);
    } else {
      setName('');
      setDescription('');
      setListId(lists[0]?.id || '');
      setDate(null);
      setDeadline(null);
      setPriority('none');
      setEstimatedTime('');
      setActualTime('');
      setSelectedLabels([]);
    }
  }, [task, lists, taskLabels, open]);

  const taskSubtasks = task ? subtasks.filter((s) => s.taskId === task.id) : [];

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim() || !task) return;

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

  const handleToggleSubtask = async (subtaskId: string) => {
    const subtask = subtasks.find((s) => s.id === subtaskId);
    if (!subtask) return;

    toggleSubtaskCompletion(subtaskId);

    try {
      await fetch(`/api/subtasks/${subtaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !subtask.completed,
        }),
      });
    } catch {
      toast.error('Failed to update subtask');
      toggleSubtaskCompletion(subtaskId);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Task name is required');
      return;
    }

    if (!listId) {
      toast.error('Please select a list');
      return;
    }

    setIsLoading(true);

    try {
      if (task) {
        // Update existing task
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            description,
            date,
            deadline,
            priority,
            estimatedTime,
            actualTime,
          }),
        });

        if (!response.ok) throw new Error('Failed to update task');
        const updatedTask = await response.json();
        updateTask(task.id, updatedTask);

        // Handle label associations for existing task
        const currentLabels = taskLabels
          .filter((tl) => tl.taskId === task.id)
          .map((tl) => tl.labelId);

        // Remove labels that are no longer selected
        for (const labelId of currentLabels) {
          if (!selectedLabels.includes(labelId)) {
            try {
              await fetch(`/api/task-labels/${task.id}/${labelId}`, {
                method: 'DELETE',
              });
              deleteTaskLabel(task.id, labelId);
            } catch {
              console.error('Failed to remove label');
            }
          }
        }

        // Add newly selected labels
        for (const labelId of selectedLabels) {
          if (!currentLabels.includes(labelId)) {
            try {
              const response = await fetch('/api/task-labels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  taskId: task.id,
                  labelId,
                }),
              });
              if (response.ok) {
                const taskLabel = await response.json();
                addTaskLabel(taskLabel);
              }
            } catch {
              console.error('Failed to add label');
            }
          }
        }

        toast.success('Task updated');
      } else {
        // Create new task
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listId,
            name,
            description,
            date,
            deadline,
            priority,
            estimatedTime,
            actualTime,
          }),
        });

        if (!response.ok) throw new Error('Failed to create task');
        const newTask = await response.json();
        addTask(newTask);

        // Add labels to newly created task
        for (const labelId of selectedLabels) {
          try {
            const labelResponse = await fetch('/api/task-labels', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                taskId: newTask.id,
                labelId,
              }),
            });
            if (labelResponse.ok) {
              const taskLabel = await labelResponse.json();
              addTaskLabel(taskLabel);
            }
          } catch {
            console.error('Failed to add label to new task');
          }
        }

        toast.success('Task created');
      }

      onOpenChange(false);
    } catch {
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Modify the task details below.' : 'Add a new task to your list.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Task name"
              autoFocus
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

          {/* List */}
          <div>
            <label className="text-sm font-medium mb-2 block">List</label>
            <select
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.emoji} {list.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as 'high' | 'medium' | 'low' | 'none')
              }
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            >
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium mb-2 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(day) => setDate(day ? day.getTime() : null)}
                    disabled={(_date) => false}
                    initialFocus
                  />
              </PopoverContent>
            </Popover>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-sm font-medium mb-2 block">Deadline</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, 'PPP') : 'Pick a deadline'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline ? new Date(deadline) : undefined}
                  onSelect={(day) => setDeadline(day ? day.getTime() : null)}
                  disabled={(_date) => false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Estimates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Est. Time</label>
              <Input
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="HH:mm"
                type="text"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Act. Time</label>
              <Input
                value={actualTime}
                onChange={(e) => setActualTime(e.target.value)}
                placeholder="HH:mm"
                type="text"
              />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="text-sm font-medium mb-2 block">Labels</label>
            <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
              {labels.length === 0 ? (
                <p className="text-xs text-muted-foreground col-span-2">
                  No labels yet
                </p>
              ) : (
                labels.map((label) => (
                    <div
                      key={label.id}
                      className="flex items-center gap-2 p-2 rounded text-sm transition-colors hover:bg-accent/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedLabels.includes(label.id)}
                        onCheckedChange={() => {
                          setSelectedLabels(
                            selectedLabels.includes(label.id)
                              ? selectedLabels.filter((id) => id !== label.id)
                              : [...selectedLabels, label.id]
                          )
                        }}
                      />
                      <span>{label.emoji}</span>
                      <span className="truncate">{label.name}</span>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Subtasks - Only show if editing */}
          {task && (
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
                        onCheckedChange={() => handleToggleSubtask(subtask.id)}
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

              <div className="flex gap-2">
                <Input
                  placeholder="Add subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask(e as unknown as React.FormEvent);
                    }
                  }}
                  className="text-sm"
                />
                <Button 
                  type="button" 
                  size="sm"
                  onClick={(e) => handleAddSubtask(e as unknown as React.FormEvent)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

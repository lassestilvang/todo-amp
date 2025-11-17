'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Toaster } from 'react-hot-toast';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const {
    setLists,
    setTasks,
    setLabels,
    setSubtasks,
    setTaskLabels,
    setReminders,
    setAttachments,
    setTaskLogs,
    setRecurrences,
  } = useStore();

  useEffect(() => {
    // Load initial data from database
    const loadData = async () => {
      try {
        const [listsRes, tasksRes, labelsRes, subtasksRes, taskLabelsRes] =
          await Promise.all([
            fetch('/api/lists'),
            fetch('/api/tasks'),
            fetch('/api/labels'),
            fetch('/api/subtasks?taskId=all'),
            fetch('/api/task-labels'),
          ]);

        if (listsRes.ok) {
          const lists = await listsRes.json();
          setLists(lists);
        }

        if (tasksRes.ok) {
          const tasks = await tasksRes.json();
          setTasks(tasks);
        }

        if (labelsRes.ok) {
          const labels = await labelsRes.json();
          setLabels(labels);
        }

        // Load all subtasks
        if (subtasksRes.ok) {
          try {
            const subtasks = await subtasksRes.json();
            if (Array.isArray(subtasks)) {
              setSubtasks(subtasks);
            }
          } catch {
            // Subtasks endpoint not found or error
          }
        }

        // Load all task labels
        if (taskLabelsRes.ok) {
          try {
            const taskLabels = await taskLabelsRes.json();
            if (Array.isArray(taskLabels)) {
              setTaskLabels(taskLabels);
            }
          } catch {
            // Task labels endpoint error
          }
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadData();
  }, [
    setLists,
    setTasks,
    setLabels,
    setSubtasks,
    setTaskLabels,
    setReminders,
    setAttachments,
    setTaskLogs,
    setRecurrences,
  ]);

  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}

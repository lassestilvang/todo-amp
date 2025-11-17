import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  List,
  Task,
  Subtask,
  Label,
  Reminder,
  Attachment,
  TaskLog,
  TaskRecurrence,
} from './db';

export type ViewType = 'today' | 'next7days' | 'upcoming' | 'all';

interface AppState {
  // Lists
  lists: List[];
  selectedListId: string | null;
  setLists: (lists: List[]) => void;
  setSelectedListId: (id: string) => void;
  addList: (list: List) => void;
  updateList: (id: string, updates: Partial<List>) => void;
  deleteList: (id: string) => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;

  // Subtasks
  subtasks: Subtask[];
  setSubtasks: (subtasks: Subtask[]) => void;
  addSubtask: (subtask: Subtask) => void;
  updateSubtask: (id: string, updates: Partial<Subtask>) => void;
  deleteSubtask: (id: string) => void;
  toggleSubtaskCompletion: (id: string) => void;

  // Labels
  labels: Label[];
  setLabels: (labels: Label[]) => void;
  addLabel: (label: Label) => void;
  updateLabel: (id: string, updates: Partial<Label>) => void;
  deleteLabel: (id: string) => void;

  // Attachments
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[]) => void;
  addAttachment: (attachment: Attachment) => void;
  deleteAttachment: (id: string) => void;

  // Reminders
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
  addReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;

  // Task Logs
  taskLogs: TaskLog[];
  setTaskLogs: (logs: TaskLog[]) => void;
  addTaskLog: (log: TaskLog) => void;

  // Recurrence
  recurrences: TaskRecurrence[];
  setRecurrences: (recurrences: TaskRecurrence[]) => void;
  addRecurrence: (recurrence: TaskRecurrence) => void;
  deleteRecurrence: (id: string) => void;

  // UI State
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  showCompleted: boolean;
  toggleShowCompleted: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    // Lists
    lists: [],
    selectedListId: null,
    setLists: (lists) => set({ lists }),
    setSelectedListId: (id) => set({ selectedListId: id }),
    addList: (list) =>
      set((state) => ({ lists: [...state.lists, list] })),
    updateList: (id, updates) =>
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === id ? { ...list, ...updates } : list
        ),
      })),
    deleteList: (id) =>
      set((state) => ({
        lists: state.lists.filter((list) => list.id !== id),
        selectedListId: state.selectedListId === id ? null : state.selectedListId,
      })),

    // Tasks
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) =>
      set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updates) =>
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      })),
    deleteTask: (id) =>
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
      })),
    toggleTaskCompletion: (id) =>
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? Date.now() : null,
                updatedAt: Date.now(),
              }
            : task
        ),
      })),

    // Subtasks
    subtasks: [],
    setSubtasks: (subtasks) => set({ subtasks }),
    addSubtask: (subtask) =>
      set((state) => ({ subtasks: [...state.subtasks, subtask] })),
    updateSubtask: (id, updates) =>
      set((state) => ({
        subtasks: state.subtasks.map((subtask) =>
          subtask.id === id ? { ...subtask, ...updates } : subtask
        ),
      })),
    deleteSubtask: (id) =>
      set((state) => ({
        subtasks: state.subtasks.filter((subtask) => subtask.id !== id),
      })),
    toggleSubtaskCompletion: (id) =>
      set((state) => ({
        subtasks: state.subtasks.map((subtask) =>
          subtask.id === id
            ? {
                ...subtask,
                completed: !subtask.completed,
                completedAt: !subtask.completed ? Date.now() : null,
              }
            : subtask
        ),
      })),

    // Labels
    labels: [],
    setLabels: (labels) => set({ labels }),
    addLabel: (label) =>
      set((state) => ({ labels: [...state.labels, label] })),
    updateLabel: (id, updates) =>
      set((state) => ({
        labels: state.labels.map((label) =>
          label.id === id ? { ...label, ...updates } : label
        ),
      })),
    deleteLabel: (id) =>
      set((state) => ({
        labels: state.labels.filter((label) => label.id !== id),
      })),

    // Attachments
    attachments: [],
    setAttachments: (attachments) => set({ attachments }),
    addAttachment: (attachment) =>
      set((state) => ({ attachments: [...state.attachments, attachment] })),
    deleteAttachment: (id) =>
      set((state) => ({
        attachments: state.attachments.filter((att) => att.id !== id),
      })),

    // Reminders
    reminders: [],
    setReminders: (reminders) => set({ reminders }),
    addReminder: (reminder) =>
      set((state) => ({ reminders: [...state.reminders, reminder] })),
    deleteReminder: (id) =>
      set((state) => ({
        reminders: state.reminders.filter((rem) => rem.id !== id),
      })),

    // Task Logs
    taskLogs: [],
    setTaskLogs: (logs) => set({ taskLogs: logs }),
    addTaskLog: (log) =>
      set((state) => ({ taskLogs: [...state.taskLogs, log] })),

    // Recurrence
    recurrences: [],
    setRecurrences: (recurrences) => set({ recurrences }),
    addRecurrence: (recurrence) =>
      set((state) => ({ recurrences: [...state.recurrences, recurrence] })),
    deleteRecurrence: (id) =>
      set((state) => ({
        recurrences: state.recurrences.filter((rec) => rec.id !== id),
      })),

    // UI State
    currentView: 'today',
    setCurrentView: (view) => set({ currentView: view }),
    selectedTaskId: null,
    setSelectedTaskId: (id) => set({ selectedTaskId: id }),
    showCompleted: true,
    toggleShowCompleted: () =>
      set((state) => ({ showCompleted: !state.showCompleted })),
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),

    // Loading states
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
  }))
);

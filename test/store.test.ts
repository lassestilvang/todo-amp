import { describe, it, expect, beforeEach } from 'bun:test';
import { useStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';

describe('Store - Task Management', () => {
  beforeEach(() => {
    const store = useStore.getState();
    store.setTasks([]);
    store.setLists([]);
    store.setSubtasks([]);
    store.setLabels([]);
  });

  it('should add a task to the store', () => {
    const store = useStore.getState();
    const task = {
      id: uuidv4(),
      listId: 'test-list',
      name: 'Test Task',
      description: 'Test Description',
      date: Date.now(),
      deadline: null,
      priority: 'high' as const,
      estimatedTime: '1:30',
      actualTime: '',
      completed: false,
      completedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.addTask(task);
    const tasks = useStore.getState().tasks;

    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe('Test Task');
    expect(tasks[0].priority).toBe('high');
  });

  it('should toggle task completion', () => {
    const store = useStore.getState();
    const taskId = uuidv4();
    const task = {
      id: taskId,
      listId: 'test-list',
      name: 'Test Task',
      description: '',
      date: null,
      deadline: null,
      priority: 'none' as const,
      estimatedTime: '',
      actualTime: '',
      completed: false,
      completedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.addTask(task);
    store.toggleTaskCompletion(taskId);

    const updatedTask = useStore.getState().tasks[0];
    expect(updatedTask.completed).toBe(true);
    expect(updatedTask.completedAt).not.toBeNull();
  });

  it('should update a task', () => {
    const store = useStore.getState();
    const taskId = uuidv4();
    const task = {
      id: taskId,
      listId: 'test-list',
      name: 'Original Name',
      description: '',
      date: null,
      deadline: null,
      priority: 'none' as const,
      estimatedTime: '',
      actualTime: '',
      completed: false,
      completedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.addTask(task);
    store.updateTask(taskId, { name: 'Updated Name' });

    const updatedTask = useStore.getState().tasks[0];
    expect(updatedTask.name).toBe('Updated Name');
  });

  it('should delete a task', () => {
    const store = useStore.getState();
    const taskId = uuidv4();
    const task = {
      id: taskId,
      listId: 'test-list',
      name: 'Task to Delete',
      description: '',
      date: null,
      deadline: null,
      priority: 'none' as const,
      estimatedTime: '',
      actualTime: '',
      completed: false,
      completedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.addTask(task);
    store.deleteTask(taskId);

    const tasks = useStore.getState().tasks;
    expect(tasks).toHaveLength(0);
  });
});

describe('Store - List Management', () => {
  beforeEach(() => {
    const store = useStore.getState();
    store.setLists([]);
    store.setTasks([]);
  });

  it('should add a list to the store', () => {
    const store = useStore.getState();
    const list = {
      id: uuidv4(),
      name: 'Work',
      color: '#3B82F6',
      emoji: '📋',
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.addList(list);
    const lists = useStore.getState().lists;

    expect(lists).toHaveLength(1);
    expect(lists[0].name).toBe('Work');
  });

  it('should update a list', () => {
    const store = useStore.getState();
    const listId = uuidv4();
    const list = {
      id: listId,
      name: 'Original',
      color: '#3B82F6',
      emoji: '📋',
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.addList(list);
    store.updateList(listId, { name: 'Updated' });

    const updatedList = useStore.getState().lists[0];
    expect(updatedList.name).toBe('Updated');
  });

  it('should delete a list', () => {
    const store = useStore.getState();
    const listId = uuidv4();
    const list = {
      id: listId,
      name: 'To Delete',
      color: '#3B82F6',
      emoji: '📋',
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.addList(list);
    store.deleteList(listId);

    const lists = useStore.getState().lists;
    expect(lists).toHaveLength(0);
  });
});

describe('Store - Subtask Management', () => {
  beforeEach(() => {
    const store = useStore.getState();
    store.setSubtasks([]);
  });

  it('should add a subtask to the store', () => {
    const store = useStore.getState();
    const subtask = {
      id: uuidv4(),
      taskId: 'test-task',
      name: 'Subtask 1',
      completed: false,
      completedAt: null,
      createdAt: Date.now(),
    };

    store.addSubtask(subtask);
    const subtasks = useStore.getState().subtasks;

    expect(subtasks).toHaveLength(1);
    expect(subtasks[0].name).toBe('Subtask 1');
  });

  it('should toggle subtask completion', () => {
    const store = useStore.getState();
    const subtaskId = uuidv4();
    const subtask = {
      id: subtaskId,
      taskId: 'test-task',
      name: 'Subtask 1',
      completed: false,
      completedAt: null,
      createdAt: Date.now(),
    };

    store.addSubtask(subtask);
    store.toggleSubtaskCompletion(subtaskId);

    const updatedSubtask = useStore.getState().subtasks[0];
    expect(updatedSubtask.completed).toBe(true);
    expect(updatedSubtask.completedAt).not.toBeNull();
  });
});

describe('Store - Label Management', () => {
  beforeEach(() => {
    const store = useStore.getState();
    store.setLabels([]);
  });

  it('should add a label to the store', () => {
    const store = useStore.getState();
    const label = {
      id: uuidv4(),
      name: 'Urgent',
      color: '#EF4444',
      emoji: '🔥',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.addLabel(label);
    const labels = useStore.getState().labels;

    expect(labels).toHaveLength(1);
    expect(labels[0].name).toBe('Urgent');
  });

  it('should delete a label', () => {
    const store = useStore.getState();
    const labelId = uuidv4();
    const label = {
      id: labelId,
      name: 'To Delete',
      color: '#EF4444',
      emoji: '🔥',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.addLabel(label);
    store.deleteLabel(labelId);

    const labels = useStore.getState().labels;
    expect(labels).toHaveLength(0);
  });
});

describe('Store - UI State Management', () => {
  it('should set current view', () => {
    const store = useStore.getState();
    store.setCurrentView('today');
    expect(useStore.getState().currentView).toBe('today');

    store.setCurrentView('next7days');
    expect(useStore.getState().currentView).toBe('next7days');
  });

  it('should toggle show completed', () => {
    const store = useStore.getState();
    const initialState = useStore.getState().showCompleted;

    store.toggleShowCompleted();
    expect(useStore.getState().showCompleted).toBe(!initialState);

    store.toggleShowCompleted();
    expect(useStore.getState().showCompleted).toBe(initialState);
  });

  it('should set search query', () => {
    const store = useStore.getState();
    store.setSearchQuery('test query');
    expect(useStore.getState().searchQuery).toBe('test query');
  });

  it('should select and deselect task', () => {
    const store = useStore.getState();
    store.setSelectedTaskId('task-123');
    expect(useStore.getState().selectedTaskId).toBe('task-123');

    store.setSelectedTaskId(null);
    expect(useStore.getState().selectedTaskId).toBeNull();
  });

  it('should select list', () => {
    const store = useStore.getState();
    store.setSelectedListId('list-123');
    expect(useStore.getState().selectedListId).toBe('list-123');
  });
});

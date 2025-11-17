'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  ListTodo,
  Calendar,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CreateListDialog } from './dialogs/create-list-dialog';
import { CreateLabelDialog } from './dialogs/create-label-dialog';

export function Sidebar() {
  const {
    lists,
    labels,
    tasks,
    currentView,
    setCurrentView,
    setSelectedListId,
    selectedListId,
  } = useStore();

  const [showCreateList, setShowCreateList] = useState(false);
  const [showCreateLabel, setShowCreateLabel] = useState(false);

  // Calculate overdue count
  const overdueCount = tasks.filter((task) => {
    if (task.completed) return false;
    if (!task.deadline) return false;
    return task.deadline < Date.now();
  }).length;

  const views = [
    {
      id: 'today',
      label: 'Today',
      icon: Calendar,
      count: tasks.filter((t) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        return (
          !t.completed &&
          t.date &&
          t.date >= todayTime &&
          t.date < todayTime + 86400000
        );
      }).length,
    },
    {
      id: 'next7days',
      label: 'Next 7 Days',
      icon: CalendarDays,
      count: tasks.filter((t) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return (
          !t.completed &&
          t.date &&
          t.date >= today.getTime() &&
          t.date <= nextWeek.getTime()
        );
      }).length,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: Clock,
      count: tasks.filter((t) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !t.completed && t.date && t.date >= today.getTime();
      }).length,
    },
    {
      id: 'all',
      label: 'All',
      icon: ListTodo,
      count: tasks.filter((t) => !t.completed).length,
    },
  ];

  return (
    <div className="w-64 bg-background border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Task Planner
        </h1>
      </div>

      {/* Views */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-3">
            Views
          </h2>
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <motion.button
                key={view.id}
                onClick={() =>
                  setCurrentView(view.id as 'today' | 'next7days' | 'upcoming' | 'all')
                }
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  currentView === view.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                whileHover={{ x: 2 }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{view.label}</span>
                </div>
                {view.count > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {view.count}
                  </Badge>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Lists Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase">
              Lists
            </h2>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setShowCreateList(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {lists.map((list) => {
              const listTaskCount = tasks.filter(
                (t) => !t.completed && t.listId === list.id
              ).length;
              return (
                <motion.button
                  key={list.id}
                  onClick={() => {
                    setSelectedListId(list.id);
                    setCurrentView('all' as const);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedListId === list.id && currentView === 'all'
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent/50'
                  )}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-center gap-2">
                    <span>{list.emoji}</span>
                    <span className="truncate">{list.name}</span>
                  </div>
                  {listTaskCount > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {listTaskCount}
                    </Badge>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Labels Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase">
              Labels
            </h2>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setShowCreateLabel(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {labels.length === 0 ? (
              <p className="text-xs text-muted-foreground">No labels yet</p>
            ) : (
              labels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <span>{label.emoji}</span>
                  <span className="truncate text-sm">{label.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Overdue Badge */}
      {overdueCount > 0 && (
        <div className="p-4 border-t border-border">
          <Badge variant="destructive" className="w-full justify-center">
            {overdueCount} Overdue Tasks
          </Badge>
        </div>
      )}

      {/* Dialogs */}
      <CreateListDialog open={showCreateList} onOpenChange={setShowCreateList} />
      <CreateLabelDialog
        open={showCreateLabel}
        onOpenChange={setShowCreateLabel}
      />
    </div>
  );
}

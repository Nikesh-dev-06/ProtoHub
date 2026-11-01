'use client';

import { useState } from 'react';
import { KanbanSquare, ListTodo } from 'lucide-react';
import { usePlannerTasks, useDeleteAnyTask } from '@/hooks/use-tasks';
import { KanbanView } from '@/components/planner/kanban-view';
import { DailyListView } from '@/components/planner/daily-list-view';
import { CreatePlannerTaskModal } from '@/components/planner/create-task-modal';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { TaskDetailModal } from '@/components/tasks/task-detail-modal';
import type { TaskCard as TaskCardType } from '@/lib/types';
import type { TaskSummary } from '@/hooks/use-tasks';

export default function PlannerPage() {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskSummary | null>(null);
  const { data: tasksData, isLoading } = usePlannerTasks();
  const deleteAnyTask = useDeleteAnyTask();

  const tasks = tasksData?.data || [];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 md:p-8 animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-ink flex items-center gap-2">
            My <span className="text-gradient">Planner</span>
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Track and organize your tasks across all projects.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface-raised p-1 rounded-lg border border-border shrink-0 self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setView('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'board'
                ? 'bg-accent/20 text-accent shadow-glow'
                : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
            }`}
          >
            <KanbanSquare size={16} />
            Board
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'list'
                ? 'bg-accent/20 text-accent shadow-glow'
                : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
            }`}
          >
            <ListTodo size={16} />
            Timeline
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors shadow-glow sm:ml-4 shrink-0"
        >
          <Plus size={16} />
          Create Task
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : tasks.length === 0 ? (
          <Card className="w-full h-full flex flex-col items-center justify-center border-dashed bg-surface/50">
            <div className="w-16 h-16 rounded-full bg-surface-raised flex items-center justify-center mb-4 border border-white/5">
              <ListTodo size={32} className="text-ink-faint" />
            </div>
            <h3 className="text-lg font-medium text-ink">No tasks assigned</h3>
            <p className="text-sm text-ink-muted mt-2 max-w-sm text-center">
              You don&apos;t have any tasks assigned to you right now. 
              Join a project and assign tasks to yourself to see them here!
            </p>
          </Card>
        ) : (
          <>
            {view === 'board' ? (
              <KanbanView tasks={tasks} onTaskClick={setSelectedTask} onDeleteTask={(t) => deleteAnyTask.mutate({ projectId: t.project.id, taskId: t.id })} />
            ) : (
              <DailyListView tasks={tasks} onTaskClick={setSelectedTask} onDeleteTask={(t) => deleteAnyTask.mutate({ projectId: t.project.id, taskId: t.id })} />
            )}
          </>
        )}
      </div>

      {showCreateModal && <CreatePlannerTaskModal onClose={() => setShowCreateModal(false)} />}
      
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          projectId={selectedTask.project.id} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
}

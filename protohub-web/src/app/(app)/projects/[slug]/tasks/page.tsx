'use client';

import { useState, type DragEvent } from 'react';
import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/use-projects';
import { useBoard, useCreateTask, useMoveTask, useDeleteTask } from '@/hooks/use-tasks';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { StatusDot } from '@/components/ui/status-dot';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import type { TaskCard as TaskCardType } from '@/lib/types';
import { TaskDetailModal } from '@/components/tasks/task-detail-modal';
import { TaskCard } from '@/components/tasks/task-card';

/** Finds where in the column's task list a Y coordinate falls, by comparing against each rendered card's midpoint. */
function getDropIndex(container: HTMLElement, clientY: number): number {
  const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-task-id]'));
  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return i;
  }
  return cards.length;
}

export default function BoardPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug);
  const { data: columns, isLoading } = useBoard(project?.id);
  const moveTask = useMoveTask(project?.id ?? '');
  const deleteTask = useDeleteTask(project?.id ?? '');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskCardType | null>(null);

  if (!project || isLoading) {
    return <p className="text-[13px] text-ink-muted">Loading board…</p>;
  }

  const onDrop = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/task-id');
    if (!taskId) return;
    const position = getDropIndex(e.currentTarget, e.clientY);
    moveTask.mutate({ taskId, columnId, position });
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns?.map((column) => (
        <div
          key={column.id}
          className="flex w-80 flex-shrink-0 flex-col rounded-xl border border-white/5 bg-surface/50 backdrop-blur-md shadow-glow"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverColumn(column.id);
          }}
          onDragLeave={() => setDragOverColumn((c) => (c === column.id ? null : c))}
          onDrop={(e) => onDrop(e, column.id)}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 mb-3">
            <h3 className="text-[14px] font-semibold text-ink">{column.name}</h3>
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-surface-raised text-[11px] font-medium text-ink-muted border border-white/5">{column.tasks.length}</span>
          </div>

          <div className={`flex-1 space-y-3 px-3 pb-3 ${dragOverColumn === column.id ? 'bg-white/5 rounded-b-xl' : ''}`}>
            {column.tasks.map((task: any) => (
              <TaskCard
                key={task.id}
                task={task}
                isDragging={draggingId === task.id}
                onDragStart={(e) => {
                  setDraggingId(task.id);
                  e.dataTransfer.setData('text/task-id', task.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragEnd={() => setDraggingId(null)}
                onDelete={() => deleteTask.mutate(task.id)}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>

          <div className="px-3 pb-3">
            <NewTaskForm projectId={project.id} columnId={column.id} />
          </div>
        </div>
      ))}

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          projectId={project.id} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
}


function NewTaskForm({ projectId, columnId }: { projectId: string; columnId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const createTask = useCreateTask(projectId);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5"
      >
        <Plus size={14} /> Add task
      </button>
    );
  }

  const submit = () => {
    if (!title.trim()) return setOpen(false);
    createTask.mutate({ columnId, title: title.trim() });
    setTitle('');
    setOpen(false);
  };

  return (
    <div className="p-2 bg-surface-raised rounded-lg border border-white/5">
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') setOpen(false);
        }}
        onBlur={submit}
        placeholder="What needs to be done?"
        className="h-9 bg-surface border-transparent focus:border-accent text-sm"
      />
      <div className="flex justify-end mt-2 gap-2">
        <button onClick={() => setOpen(false)} className="text-[11px] text-ink-muted hover:text-ink px-2 py-1">Cancel</button>
        <button onClick={submit} className="text-[11px] bg-accent text-white px-3 py-1 rounded hover:bg-accent-hover font-medium">Save</button>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, MoreHorizontal, Pencil, Target, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import type { TaskCard as TaskCardType } from '@/lib/types';
import { Avatar } from '@/components/ui/avatar';
import { StatusDot } from '@/components/ui/status-dot';
import { DragEvent } from 'react';
import { useUpdateTaskStatus } from '@/hooks/use-tasks';

interface TaskCardProps {
  task: TaskCardType;
  isDragging?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function TaskCard({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onDelete,
  onClick,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const updateTaskStatus = useUpdateTaskStatus();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setShowStatusOptions(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);
  return (
    <div
      data-task-id={task.id}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={(e) => {
        if (isDragging) return;
        onClick?.();
      }}
      className={`group relative rounded-lg border border-white/5 bg-surface hover:border-accent/30 p-3.5 shadow-sm transition-all hover:shadow-glow ${onDragStart ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} ${isDragging ? 'opacity-40 scale-95' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[14px] font-medium leading-snug text-ink break-words">
          {task.title}
        </p>
        {onDelete && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="opacity-0 transition-opacity group-hover:opacity-100 text-ink-muted hover:text-ink shrink-0 mt-0.5 p-1 rounded hover:bg-surface-hover"
              aria-label="Task options"
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-surface-raised border border-border rounded-md shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onClick?.();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface-hover transition-colors text-left"
                >
                  <Pencil size={14} className="text-ink-muted" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusOptions(!showStatusOptions);
                  }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-ink hover:bg-surface-hover transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-ink-muted" />
                    Change Status
                  </div>
                  <ChevronDown size={14} className={`text-ink-muted transition-transform ${showStatusOptions ? 'rotate-180' : ''}`} />
                </button>
                {showStatusOptions && (
                  <div className="bg-bg/50 py-1 border-y border-white/5 flex flex-col">
                    {['Backlog', 'In Progress', 'Done'].map(status => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation();
                          if ('project' in task && (task as any).project) {
                            updateTaskStatus.mutate({ 
                              projectId: (task as any).project.id, 
                              taskId: task.id, 
                              statusName: status 
                            });
                          }
                          setMenuOpen(false);
                          setShowStatusOptions(false);
                        }}
                        className="w-full flex items-center justify-between pl-8 pr-3 py-1.5 text-[13px] text-ink-muted hover:text-ink hover:bg-surface-hover transition-colors text-left"
                      >
                        {status}
                        {updateTaskStatus.isPending && updateTaskStatus.variables?.statusName === status && (
                          <Loader2 size={12} className="animate-spin text-accent" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                <div className="h-px bg-white/5 my-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors text-left"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {task.description && <p className="mt-1.5 mb-3 line-clamp-2 text-[12px] text-ink-muted leading-relaxed">{task.description}</p>}
      <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex flex-col gap-1 items-start">
          <div className="flex items-center gap-2">
            <StatusDot status={task.priority} />
            <span className="text-[11px] font-medium text-ink-faint uppercase tracking-wider">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Date'}
            </span>
          </div>
          {'project' in task && (task as any).project && (
            <span className="text-[10px] font-semibold text-accent/80 uppercase tracking-wide bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
              {(task as any).project.title}
            </span>
          )}
        </div>
        {task.assignee ? 
          <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size={24} className="ring-2 ring-bg" /> : 
          <div className="h-6 w-6 rounded-full border border-dashed border-white/20 flex items-center justify-center"><Plus size={10} className="text-ink-faint"/></div>
        }
      </div>

      {showDeleteConfirm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-surface border border-border rounded-xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-center relative">
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-danger" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Delete Task?</h3>
            <p className="text-sm text-ink-muted mb-8 leading-relaxed">
              Are you sure you want to delete <span className="text-ink font-medium">&quot;{task.title}&quot;</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-ink bg-surface-raised border border-white/5 rounded-lg hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                  onDelete?.();
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors shadow-glow-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

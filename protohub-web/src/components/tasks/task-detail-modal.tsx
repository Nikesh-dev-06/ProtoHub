'use client';

import { useEffect, useState } from 'react';
import { ProtoEditor } from '@/components/editor/proto-editor';
import { X, Calendar, User, AlignLeft, Target, ListTodo, Loader2 } from 'lucide-react';
import { useUpdateTask, useMoveTask, useBoard } from '@/hooks/use-tasks';
import { useProjectMembers } from '@/hooks/use-projects';
import { Avatar } from '@/components/ui/avatar';
import { StatusDot } from '@/components/ui/status-dot';
import type { TaskCard } from '@/lib/types';

interface TaskDetailModalProps {
  task: TaskCard;
  projectId: string;
  onClose: () => void;
}

export function TaskDetailModal({ task, projectId, onClose }: TaskDetailModalProps) {
  const updateTask = useUpdateTask(projectId);
  const moveTask = useMoveTask(projectId);
  const { data: columns, isLoading: isLoadingColumns } = useBoard(projectId);
  const { data: members = [] } = useProjectMembers(projectId);
  
  const [title, setTitle] = useState(task.title);



  // Handle title save
  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) {
      updateTask.mutate({ taskId: task.id, title: title.trim() });
    } else {
      setTitle(task.title); // revert if empty
    }
  };

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-surface border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-slide-up">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-raised/50">
          <div className="flex items-center gap-2 text-ink-muted">
            <ListTodo size={16} />
            <span className="text-[13px] font-medium tracking-wide">TASK DETAIL</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/10 text-ink-muted hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-full bg-transparent text-3xl font-bold text-ink placeholder:text-ink-faint outline-none mb-8 border-b border-transparent focus:border-white/10 pb-2 transition-colors"
            placeholder="Task title"
          />

          {/* Properties Grid */}
          <div className="grid grid-cols-[140px_1fr] gap-y-4 gap-x-4 mb-10 text-[13px]">
            {/* Status */}
            <div className="flex items-center gap-2 text-ink-muted font-medium">
              <Target size={16} className="text-ink-faint" />
              Status
            </div>
            <div className="flex items-center gap-2 h-7">
              <StatusDot status={task.priority} />
              {isLoadingColumns ? (
                <Loader2 size={12} className="animate-spin text-ink-faint" />
              ) : (
                <select
                  value={task.columnId}
                  onChange={(e) => {
                    const newColumnId = e.target.value;
                    if (newColumnId !== task.columnId) {
                      moveTask.mutate({ taskId: task.id, columnId: newColumnId, position: 0 }); // Put it at the top of the new column
                    }
                  }}
                  className="bg-transparent text-ink font-medium text-[13px] outline-none cursor-pointer hover:bg-white/5 px-1 -ml-1 rounded transition-colors appearance-none pr-4"
                >
                  {columns?.map((c) => (
                    <option key={c.id} value={c.id} className="bg-surface text-ink">{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-2 text-ink-muted font-medium">
              <User size={16} className="text-ink-faint" />
              Assignee
            </div>
            <div className="flex items-center h-7">
              <select
                value={task.assignee?.id || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateTask.mutate({ taskId: task.id, assigneeId: val || null });
                }}
                className="bg-transparent text-ink font-medium text-[13px] outline-none cursor-pointer hover:bg-white/5 px-1 -ml-1 rounded transition-colors appearance-none pr-4"
              >
                <option value="" className="bg-surface text-ink italic">Unassigned</option>
                {members.map((member: any) => (
                  <option key={member.user.id} value={member.user.id} className="bg-surface text-ink">
                    {member.user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2 text-ink-muted font-medium">
              <Calendar size={16} className="text-ink-faint" />
              Due Date
            </div>
            <div className="flex items-center h-7">
              <input
                type="date"
                value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateTask.mutate({ 
                    taskId: task.id, 
                    dueDate: val ? new Date(val).toISOString() : null 
                  });
                }}
                className="bg-transparent text-ink font-medium text-[13px] outline-none cursor-pointer hover:bg-white/5 px-1 -ml-1 rounded transition-colors"
              />
            </div>
          </div>

          <hr className="border-white/5 mb-8" />

          {/* Description Editor */}
          <div className="mb-2 flex items-center gap-2 text-ink-muted font-medium text-[15px]">
            <AlignLeft size={18} className="text-ink-faint" />
            Description
          </div>
          <div className="pl-6 pb-20 relative">
            <ProtoEditor
              initialContent={task.description || ''}
              onUpdate={(html) => {
                if (html !== task.description) {
                  updateTask.mutate({ taskId: task.id, description: html });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

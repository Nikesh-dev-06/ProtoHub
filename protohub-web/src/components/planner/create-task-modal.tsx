'use client';

import { useState } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useMyProjects, useCreateProject } from '@/hooks/use-projects';
import { useCreateTask } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { api } from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';

interface CreatePlannerTaskModalProps {
  onClose: () => void;
}

export function CreatePlannerTaskModal({ onClose }: CreatePlannerTaskModalProps) {
  const { user } = useAuth();
  const { data: projectsData, isLoading: isLoadingProjects } = useMyProjects();
  const projects = projectsData?.data || [];
  
  const [projectName, setProjectName] = useState<string>('');
  const [statusName, setStatusName] = useState<string>('Backlog');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProject = useCreateProject();
  const qc = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectName.trim() || !statusName || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let targetProjectId = '';

      // 1. Check if project exists
      const existingProject = projects.find(p => p.title.toLowerCase() === projectName.trim().toLowerCase());
      
      if (existingProject) {
        targetProjectId = existingProject.id;
      } else {
        // 2. Auto-create project
        const newProject = await createProject.mutateAsync({
          title: projectName.trim(),
          description: 'Automatically created from Planner.',
        });
        targetProjectId = newProject.id;
      }

      // 3. Fetch its columns
      const columns = await api.get<any[]>(`/projects/${targetProjectId}/board`);
      
      // 4. Find the matching column, fallback to first column
      let targetColumnId = columns.find(c => c.name.toLowerCase() === statusName.toLowerCase())?.id;
      if (!targetColumnId && columns.length > 0) {
        targetColumnId = columns[0].id;
      }

      if (!targetColumnId) {
        throw new Error('Project has no columns.');
      }

      // 5. Create the task
      await api.post(`/projects/${targetProjectId}/tasks`, {
        title: title.trim(),
        columnId: targetColumnId,
        assigneeId: user?.id
      });

      // 6. Refresh planner
      qc.invalidateQueries({ queryKey: ['my-tasks', 'planner'] });
      qc.invalidateQueries({ queryKey: ['board', targetProjectId] });
      
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-ink">Create New Task</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink p-1 rounded-md hover:bg-surface-hover">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div>
            <Label htmlFor="project">Project Name</Label>
            <Input
              id="project"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. My Website Redesign"
              required
            />
            <p className="text-[11px] text-ink-muted mt-1.5 leading-snug">
              If this project doesn&apos;t exist, it will be automatically created for you.
            </p>
          </div>

          <div>
            <Label htmlFor="column">Status (Column)</Label>
            <div className="relative mt-1">
              <select
                id="column"
                value={statusName}
                onChange={(e) => setStatusName(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all appearance-none pr-10"
              >
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={!title.trim() || !projectName.trim() || !statusName || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

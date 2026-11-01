'use client';

import { TaskSummary } from '@/hooks/use-tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { Badge } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface KanbanViewProps {
  tasks: (TaskSummary & { column: { id: string; name: string } })[];
  onTaskClick: (task: TaskSummary) => void;
  onDeleteTask?: (task: TaskSummary) => void;
}

export function KanbanView({ tasks, onTaskClick, onDeleteTask }: KanbanViewProps) {
  // Group by rough status mapped from column names
  const groupedTasks = {
    todo: tasks.filter(t => t.column.name.toLowerCase().includes('todo') || t.column.name.toLowerCase().includes('backlog') || t.column.name.toLowerCase().includes('to do') || t.column.name.toLowerCase().includes('open')),
    inProgress: tasks.filter(t => t.column.name.toLowerCase().includes('progress') || t.column.name.toLowerCase().includes('doing') || t.column.name.toLowerCase().includes('review')),
    done: tasks.filter(t => t.column.name.toLowerCase().includes('done') || t.column.name.toLowerCase().includes('complete') || t.column.name.toLowerCase().includes('closed')),
    other: [] as typeof tasks,
  };

  // Anything that didn't match gets put in 'todo' by default, or 'other'
  tasks.forEach(t => {
    if (!groupedTasks.todo.find(x => x.id === t.id) && 
        !groupedTasks.inProgress.find(x => x.id === t.id) && 
        !groupedTasks.done.find(x => x.id === t.id)) {
      groupedTasks.todo.push(t);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-y-auto pb-8">
      
      {/* To Do Column */}
      <div className="flex flex-col h-full min-h-[300px]">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="font-semibold text-ink flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ink-muted" />
            To Do
          </h3>
          <Badge variant="outline" className="text-xs bg-surface border-border text-ink-muted">
            {groupedTasks.todo.length}
          </Badge>
        </div>
        <Card className="flex-1 p-3 bg-surface-raised/30 border-dashed border-white/5 space-y-3">
          {groupedTasks.todo.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask?.(task)} />
          ))}
        </Card>
      </div>

      {/* In Progress Column */}
      <div className="flex flex-col h-full min-h-[300px]">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="font-semibold text-ink flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            In Progress
          </h3>
          <Badge variant="outline" className="text-xs bg-surface border-border text-ink-muted">
            {groupedTasks.inProgress.length}
          </Badge>
        </div>
        <Card className="flex-1 p-3 bg-surface-raised/30 border-dashed border-white/5 space-y-3">
          {groupedTasks.inProgress.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask?.(task)} />
          ))}
        </Card>
      </div>

      {/* Completed Column */}
      <div className="flex flex-col h-full min-h-[300px]">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="font-semibold text-ink flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Completed
          </h3>
          <Badge variant="outline" className="text-xs bg-surface border-border text-ink-muted">
            {groupedTasks.done.length}
          </Badge>
        </div>
        <Card className="flex-1 p-3 bg-surface-raised/30 border-dashed border-white/5 space-y-3 opacity-70">
          {groupedTasks.done.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask?.(task)} />
          ))}
        </Card>
      </div>

    </div>
  );
}

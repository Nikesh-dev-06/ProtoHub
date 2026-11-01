'use client';

import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useUpdateTask } from '@/hooks/use-tasks';
import { TaskSummary } from '@/hooks/use-tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { DroppableColumn } from './droppable-column';
import { format, isToday, isTomorrow, isPast, startOfDay, addDays } from 'date-fns';

interface DailyListViewProps {
  tasks: (TaskSummary & { column: { id: string; name: string } })[];
  onTaskClick: (task: TaskSummary) => void;
  onDeleteTask?: (task: TaskSummary) => void;
}

export function DailyListView({ tasks, onTaskClick, onDeleteTask }: DailyListViewProps) {
  const [activeTask, setActiveTask] = useState<TaskSummary | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const updateTask = useUpdateTask(''); // We'll override the mutationFn manually or create a custom call

  // Group tasks by date
  const groupedTasks = {
    overdue: tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))),
    today: tasks.filter(t => t.dueDate && isToday(new Date(t.dueDate))),
    tomorrow: tasks.filter(t => t.dueDate && isTomorrow(new Date(t.dueDate))),
    upcoming: tasks.filter(t => t.dueDate && !isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)) && !isTomorrow(new Date(t.dueDate))),
    unscheduled: tasks.filter(t => !t.dueDate),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const targetGroup = over.id as keyof typeof groupedTasks;
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    // Determine new due date based on group
    let newDueDate: Date | null = null;
    const now = new Date();

    switch (targetGroup) {
      case 'today':
        newDueDate = startOfDay(now);
        break;
      case 'tomorrow':
        newDueDate = startOfDay(addDays(now, 1));
        break;
      case 'upcoming':
        newDueDate = startOfDay(addDays(now, 7)); // Just set it a week out as a placeholder
        break;
      case 'unscheduled':
        newDueDate = null;
        break;
      default:
        return; // Can't drop into overdue
    }

    // Call API directly since useUpdateTask hook is scoped to a single project
    try {
      await fetch(`/api/projects/${task.project.id}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ dueDate: newDueDate ? newDueDate.toISOString() : null })
      });
      // Force a reload of the page to reflect changes since we aren't using the precise qc invalidation
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-y-auto pb-8">
        
        {groupedTasks.overdue.length > 0 && (
          <DroppableColumn id="overdue" title="Overdue" count={groupedTasks.overdue.length} items={groupedTasks.overdue.map(t => t.id)}>
            <div className="space-y-3">
              {groupedTasks.overdue.map(task => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask?.(task)} />
              ))}
            </div>
          </DroppableColumn>
        )}

        <DroppableColumn id="today" title="Today" count={groupedTasks.today.length} items={groupedTasks.today.map(t => t.id)}>
          <div className="space-y-3 min-h-[100px]">
            {groupedTasks.today.map(task => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask?.(task)} />
            ))}
          </div>
        </DroppableColumn>

        <DroppableColumn id="tomorrow" title="Tomorrow" count={groupedTasks.tomorrow.length} items={groupedTasks.tomorrow.map(t => t.id)}>
          <div className="space-y-3 min-h-[100px]">
            {groupedTasks.tomorrow.map(task => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask?.(task)} />
            ))}
          </div>
        </DroppableColumn>

        <DroppableColumn id="upcoming" title="Upcoming" count={groupedTasks.upcoming.length} items={groupedTasks.upcoming.map(t => t.id)}>
          <div className="space-y-3 min-h-[100px]">
            {groupedTasks.upcoming.map(task => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask?.(task)} />
            ))}
          </div>
        </DroppableColumn>

        <DroppableColumn id="unscheduled" title="Unscheduled" count={groupedTasks.unscheduled.length} items={groupedTasks.unscheduled.map(t => t.id)}>
          <div className="space-y-3 min-h-[100px]">
            {groupedTasks.unscheduled.map(task => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask?.(task)} />
            ))}
          </div>
        </DroppableColumn>

      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 scale-105 shadow-glow transition-all opacity-80 cursor-grabbing">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

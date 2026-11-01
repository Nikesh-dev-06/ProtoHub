'use client';

import { useDroppable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/avatar';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface DroppableColumnProps {
  id: string;
  title: string;
  count: number;
  items: string[];
  children: React.ReactNode;
}

export function DroppableColumn({ id, title, count, items, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="font-semibold text-ink flex items-center gap-2">
          {title}
        </h3>
        <Badge variant="outline" className="text-xs bg-surface border-border text-ink-muted">
          {count}
        </Badge>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-3 transition-colors rounded-xl ${
          isOver ? 'bg-accent/10 border-accent/30' : 'bg-surface-raised/50 border border-dashed border-white/5'
        }`}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
    </div>
  );
}

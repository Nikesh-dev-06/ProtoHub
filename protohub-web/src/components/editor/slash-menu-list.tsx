import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { cn } from '@/lib/cn';

interface SlashMenuListProps {
  items: any[];
  command: (item: any) => void;
}

export const SlashMenuList = forwardRef((props: SlashMenuListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (!props.items.length) {
    return null;
  }

  return (
    <div className="z-50 w-64 overflow-hidden rounded-xl border border-white/10 bg-surface/90 backdrop-blur-xl shadow-glow animate-fade-in p-1">
      {props.items.map((item, index) => (
        <button
          key={index}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
            index === selectedIndex ? "bg-surface-hover text-ink" : "text-ink-muted hover:bg-surface-hover hover:text-ink"
          )}
          onClick={() => selectItem(index)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/5 bg-surface-raised">
            {item.icon}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{item.title}</span>
            <span className="text-[11px] text-ink-faint">{item.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
});

SlashMenuList.displayName = 'SlashMenuList';

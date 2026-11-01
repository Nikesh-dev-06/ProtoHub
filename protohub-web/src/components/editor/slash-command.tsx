import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { SlashMenuList } from './slash-menu-list';
import { Heading1, Heading2, Heading3, List, ListTodo, CodeSquare, Sparkles } from 'lucide-react';

export const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: 'Ask AI',
      description: 'Generate content automatically',
      icon: <Sparkles size={18} className="text-warning" />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).run();
        // Fire custom event for AI trigger
        window.dispatchEvent(new CustomEvent('proto-ai-trigger', { detail: { editor } }));
      },
    },
    {
      title: 'Heading 1',
      description: 'Large section heading',
      icon: <Heading1 size={18} />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: <Heading2 size={18} />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading',
      icon: <Heading3 size={18} />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      },
    },
    {
      title: 'To-do List',
      description: 'Track tasks with a checklist',
      icon: <ListTodo size={18} />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bulleted list',
      icon: <List size={18} />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Code Block',
      description: 'Syntax highlighted code',
      icon: <CodeSquare size={18} />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
  ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
};

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export const slashSuggestion = {
  items: getSuggestionItems,
  render: () => {
    let component: ReactRenderer<any>;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(SlashMenuList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

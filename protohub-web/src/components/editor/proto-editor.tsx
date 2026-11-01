'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Link from '@tiptap/extension-link';
import { common, createLowlight } from 'lowlight';
import { SlashCommand, slashSuggestion } from './slash-command';
import { useEffect } from 'react';

// Setup lowlight for code blocks
const lowlight = createLowlight(common);

interface ProtoEditorProps {
  initialContent: string;
  onUpdate: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function ProtoEditor({ initialContent, onUpdate, placeholder = "Type '/' for commands", className }: ProtoEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We use CodeBlockLowlight instead
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent underline underline-offset-4 decoration-accent/50 hover:decoration-accent transition-colors cursor-pointer',
        },
      }),
      SlashCommand.configure({
        suggestion: slashSuggestion,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: `prose prose-sm prose-invert focus:outline-none min-h-[150px] max-w-none text-[14px] leading-relaxed text-ink-muted ${className || ''}`,
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  // Handle custom AI trigger from Slash Command
  useEffect(() => {
    const handleAITrigger = (e: any) => {
      const targetEditor = e.detail.editor;
      // Here we would normally trigger an AI modal or generation flow.
      // For now, we will insert a loading placeholder, then mock a response.
      targetEditor.chain().focus().insertContent('<p><em>✨ AI is thinking...</em></p>').run();
      
      setTimeout(() => {
        // Find and replace the loading placeholder (basic implementation)
        const html = targetEditor.getHTML();
        const replaced = html.replace('<p><em>✨ AI is thinking...</em></p>', '<p><strong>ProtoHub AI:</strong> Here is a generated response to help you structure your task!</p>');
        targetEditor.commands.setContent(replaced);
      }, 1500);
    };

    window.addEventListener('proto-ai-trigger', handleAITrigger);
    return () => window.removeEventListener('proto-ai-trigger', handleAITrigger);
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full">
      <EditorContent editor={editor} />
    </div>
  );
}

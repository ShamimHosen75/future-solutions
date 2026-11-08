"use client";

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  id?: string;
  invalid?: boolean;
};

/** Tiptap editor producing the HTML rendered by <Prose> on the public site. */
export function RichTextEditor({ value, onChange, placeholder, id, invalid }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        id: id ?? "",
        class:
          "prose-editor min-h-48 px-4 py-3 text-sm text-silver focus:outline-none [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-white [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-white [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-cyan [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-cyan [&_a]:underline",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Keep the editor in sync when the form resets to new values.
  React.useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== (current === "<p></p>" ? "" : current)) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link")["href"] as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const Btn = ({ onClick, active, label, children }: { onClick: () => void; active?: boolean; label: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn("rounded p-1.5 text-muted hover:bg-white/5 hover:text-white", active && "bg-white/10 text-white")}
    >
      {children}
    </button>
  );

  return (
    <div className={cn("rounded-[var(--radius-md)] border border-border bg-surface/60 focus-within:border-cyan/60", invalid && "border-orange/70")}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
        <Btn label="Bold" active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="size-4" /></Btn>
        <Btn label="Italic" active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="size-4" /></Btn>
        <span className="mx-1 h-4 w-px bg-border" />
        <Btn label="Heading 2" active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="size-4" /></Btn>
        <Btn label="Heading 3" active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="size-4" /></Btn>
        <span className="mx-1 h-4 w-px bg-border" />
        <Btn label="Bullet list" active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="size-4" /></Btn>
        <Btn label="Numbered list" active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered className="size-4" /></Btn>
        <Btn label="Quote" active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()}><Quote className="size-4" /></Btn>
        <span className="mx-1 h-4 w-px bg-border" />
        <Btn label="Add link" active={editor?.isActive("link")} onClick={setLink}><Link2 className="size-4" /></Btn>
        <Btn label="Remove link" onClick={() => editor?.chain().focus().unsetLink().run()}><Unlink className="size-4" /></Btn>
        <span className="ml-auto flex">
          <Btn label="Undo" onClick={() => editor?.chain().focus().undo().run()}><Undo2 className="size-4" /></Btn>
          <Btn label="Redo" onClick={() => editor?.chain().focus().redo().run()}><Redo2 className="size-4" /></Btn>
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

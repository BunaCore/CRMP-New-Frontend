"use client";

import * as React from "react";

import Editor from "@monaco-editor/react";
import { Code2, Loader2, Terminal } from "lucide-react";
import { useTheme } from "next-themes";

interface EditorPanelProps {
  language: string;
  initialContent: string;
  onChange: (value: string) => void;
}

export function EditorPanel({ language, initialContent, onChange }: EditorPanelProps) {
  const [content, setContent] = React.useState(initialContent);
  const { theme, systemTheme } = useTheme();

  // Determine current effective theme
  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");

  React.useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      onChange(value);
    }
  };

  return (
    <div className="border-border bg-background relative flex h-full flex-col border-r">
      {/* Editor Toolbar */}
      <div className="border-border bg-muted/30 text-muted-foreground relative z-10 flex h-12 w-full flex-shrink-0 items-center justify-between border-b px-5">
        <div className="flex items-center gap-2">
          {language === "typescript" || language === "javascript" ? (
            <Code2 className="h-4 w-4 text-yellow-500" />
          ) : (
            <Terminal className="h-4 w-4 text-sky-500" />
          )}
          <span className="text-foreground font-mono text-[13px] font-medium uppercase">{language} Editor</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-3 text-[12px] font-medium">
          <span>Live Sync</span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="bg-background relative w-full flex-1">
        <Editor
          height="100%"
          language={language}
          value={content}
          onChange={handleEditorChange}
          theme={isDark ? "vs-dark" : "vs-light"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineHeight: 1.6,
            padding: { top: 24, bottom: 24 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            wordWrap: "on",
          }}
          loading={
            <div className="bg-background text-muted-foreground flex h-full w-full items-center justify-center gap-2">
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Initializing Workspace...</span>
            </div>
          }
        />
      </div>
    </div>
  );
}

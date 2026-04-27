"use client";

import { useState } from "react";

import { RagComposer } from "./rag-composer";
import { type RagMessage, RagMessageList } from "./rag-message-list";
import { RagUploadPanel, type UploadedFile } from "./rag-upload-panel";

export function RagTab() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<RagMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleUpload = (newFiles: File[]) => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const mockUploaded = newFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type || "application/pdf",
        size: file.size,
        status: "ready" as const,
        pages: Math.floor(Math.random() * 20) + 1,
      }));
      setFiles((prev) => [...prev, ...mockUploaded]);
      setIsUploading(false);
    }, 1500);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (files.length === 1) {
      setMessages([]); // Clear chat if last file is removed
    }
  };

  const handleSend = (content: string) => {
    if (files.length === 0) return;

    const userMessage: RagMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    // Simulate RAG Assistant response
    setTimeout(() => {
      const assistantMessage: RagMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: `Based on the provided documents, here is what I found regarding "${content}". The research indicates significant overlap with your query, particularly in the methodology section.`,
        timestamp: new Date(),
        sources: [
          {
            id: "s1",
            fileId: files[0].id,
            fileName: files[0].name,
            page: 4,
            excerpt:
              "The methodology relies heavily on qualitative analysis, specifically focusing on user interaction metrics...",
          },
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-slate-50 dark:bg-zinc-950/50">
      {/* Top Zone: Upload & Document Context */}
      <div className="z-10 shrink-0 border-border border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-zinc-800">
        <RagUploadPanel files={files} onUpload={handleUpload} onRemove={handleRemoveFile} isUploading={isUploading} />
      </div>

      {/* Middle Zone: Message List */}
      <RagMessageList messages={messages} isThinking={isThinking} isEmpty={files.length === 0} />

      {/* Bottom Zone: Composer */}
      <div className="mt-auto shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-zinc-950">
        <RagComposer
          onSend={handleSend}
          onQuickAction={handleQuickAction}
          disabled={files.length === 0 || isUploading}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

import { toast } from "sonner";

import { RagComposer } from "./rag-composer";
import { type RagMessage, RagMessageList } from "./rag-message-list";
import { RagUploadPanel, type UploadedFile } from "./rag-upload-panel";

export function RagTab() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<RagMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_URL ?? "http://localhost:8000";

  const handleUpload = async (newFiles: File[]) => {
    setIsUploading(true);
    try {
      const uploadedFiles: UploadedFile[] = [];
      for (const file of newFiles) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch(`${mlApiUrl}/rag/upload`, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            toast.error(`Failed to upload ${file.name}: ${errorData.detail || "Upload failed"}`);
            continue;
          }

          const data = await res.json();

          uploadedFiles.push({
            id: data.document_id,
            name: data.filename,
            type: file.type || "application/pdf",
            size: file.size,
            status: "ready" as const,
            pages: data.num_chunks,
          });
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast.error(`Failed to upload ${file.name}. Please check your connection.`);
        }
      }

      if (uploadedFiles.length > 0) {
        setFiles((prev) => [...prev, ...uploadedFiles]);
        toast.success(`Successfully uploaded ${uploadedFiles.length} document(s)`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (files.length === 1) {
      setMessages([]); // Clear chat if last file is removed
    }
  };

  const handleSend = async (content: string) => {
    if (files.length === 0) return;

    const userMessage: RagMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const document_ids = files.map((f) => f.id);

      const res = await fetch(`${mlApiUrl}/rag/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_ids, query: content }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();

      const assistantMessage: RagMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in RAG chat:", error);
      toast.error("Failed to get a response from the research assistant.");
      const errorMessage: RagMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content:
          "Sorry, there was an error processing your request. Please ensure the ML service is running and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
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

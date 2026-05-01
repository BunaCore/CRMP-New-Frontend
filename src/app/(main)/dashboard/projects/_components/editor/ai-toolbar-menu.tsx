"use client";

import { useState } from "react";

import type { Editor } from "@tiptap/react";
import {
  ChevronLeft,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  List,
  PenTool,
  Sparkles,
  Users,
  WrapText,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useWorkspace } from "../workspace/workspace-context";

interface AiToolbarMenuProps {
  editor: Editor;
}

export function AiToolbarMenu({ editor }: AiToolbarMenuProps) {
  const { setAutoSendTrigger, setIsChatOpen } = useWorkspace();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAiAction = (promptPrefix: string, requestType: import("@/lib/ai/types").AiRequestType) => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");

    const trimmedText = selectedText?.trim();

    if (!trimmedText || trimmedText.length < 3) {
      alert("Please select a valid sentence or passage first.");
      setIsExpanded(false);
      return;
    }

    setAutoSendTrigger({
      prompt: promptPrefix,
      context: trimmedText,
      timestamp: Date.now(),
      requestType,
      from,
      to,
    });
    setIsChatOpen(true);
    setIsExpanded(false); // Close the menu after action
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 rounded-lg px-2 text-primary hover:bg-primary/10 hover:text-primary"
        title="AI Assistant"
        onClick={() => setIsExpanded(true)}
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span className="font-semibold text-xs">AI</span>
      </Button>
    );
  }

  return (
    <div className="slide-in-from-left-2 fade-in flex animate-in items-center gap-0.5 duration-200">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-zinc-800"
        title="Back"
        onClick={() => setIsExpanded(false)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="mx-0.5 h-4 w-px bg-border/60" />

      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 rounded-lg p-0 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400"
        title="Summarize"
        onClick={() => handleAiAction("Summarize this text", "SUMMARIZE_SELECTION")}
      >
        <FileText className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 rounded-lg p-0 text-green-500 hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400"
        title="Explain"
        onClick={() => handleAiAction("Explain this text", "EXPLAIN_SELECTION")}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 rounded-lg p-0 text-amber-500 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
        title="Improve grammar"
        onClick={() => handleAiAction("Improve the grammar of this text", "GRAMMAR_FIX")}
      >
        <PenTool className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 rounded-lg p-0 text-purple-500 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400"
        title="Suggest outline"
        onClick={() => handleAiAction("Suggest an outline based on this text", "OUTLINE_SUGGESTION")}
      >
        <List className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 rounded-lg p-0 text-pink-500 hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-400"
        title="Generate caption"
        onClick={() => handleAiAction("Generate a caption for this text", "CAPTION_GENERATION")}
      >
        <WrapText className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 rounded-lg p-0 text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
        title="Find experts"
        onClick={() => handleAiAction("Recommend collaborators for this topic", "COLLABORATOR_RECOMMENDATION")}
      >
        <Users className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 rounded-lg p-0 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
        title="Generate diagram"
        onClick={() => handleAiAction("Insert an image diagram representing this text", "INSERT_DIAGRAM")}
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

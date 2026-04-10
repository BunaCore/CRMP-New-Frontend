"use client";

import * as React from "react";

import {
  ArrowUp,
  AtSign,
  ChevronDown,
  FileText,
  MoreHorizontal,
  Paperclip,
  PenTool,
  Plus,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceStore } from "@/store/workspace-store";

interface ChatPanelProps {
  fileId: string;
  fileTitle: string;
}

export function ChatPanel({ fileId, fileTitle }: ChatPanelProps) {
  const [inputText, setInputText] = React.useState("");

  const chatHistories = useWorkspaceStore((state) => state.chatHistories);
  const sendMessageStore = useWorkspaceStore((state) => state.sendMessage);

  const history = chatHistories[fileId] || [];

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessageStore(fileId, inputText);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-background text-foreground">
      <Tabs defaultValue="chat" className="flex w-full flex-1 flex-col">
        <TabsList className="relative z-10 h-14 w-full shrink-0 justify-start space-x-2 rounded-none border-border border-b bg-background px-4 text-muted-foreground sm:px-6">
          <TabsTrigger
            value="chat"
            className="rounded-none px-3 py-4 font-semibold text-[13px] transition-colors hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="rounded-none px-3 py-4 font-medium text-[13px] transition-colors hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Notes
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="rounded-none px-3 py-4 font-medium text-[13px] transition-colors hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="chat"
          className="m-0 flex h-full flex-1 flex-col overflow-hidden bg-background p-0 outline-none"
        >
          {/* Chat header area */}
          <div className="flex shrink-0 items-center justify-between px-6 py-4 text-foreground">
            <div className="-ml-3 flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-[14px] transition-colors hover:bg-muted">
              Current Session <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-6 py-2" ref={scrollRef}>
            <div className="flex flex-col gap-6 pb-4">
              {history.length === 0 && (
                <div className="py-10 text-center text-muted-foreground text-sm">
                  Send a message to start chatting with{" "}
                  <span className="font-semibold text-foreground">{fileTitle}</span>.
                </div>
              )}

              {history.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "ai" ? (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground">
                      <span className="font-bold text-[11px] text-background">ME</span>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                      msg.role === "ai"
                        ? "rounded-2xl rounded-tl-sm border border-border bg-muted text-foreground"
                        : "rounded-2xl rounded-tr-sm border border-primary bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-[1.6]">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} className="h-1" />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="z-10 mt-auto shrink-0 border-border border-t bg-background p-4 sm:p-5">
            <div className="group flex flex-col overflow-hidden rounded-xl border border-input bg-background shadow-sm transition-all focus-within:border-ring focus-within:ring-[2px] focus-within:ring-ring">
              {/* Context Tag */}
              <div className="flex items-center px-3 pt-3 pb-1">
                <div className="flex max-w-full shrink-0 items-center gap-1.5 overflow-hidden rounded-md bg-secondary px-2.5 py-1 font-medium text-[12px] text-secondary-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="truncate">{fileTitle}</span>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask this file a question..."
                className="max-h-[160px] min-h-[44px] w-full resize-none bg-transparent px-4 py-2 font-sans text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
                rows={1}
              />

              {/* Bottom tools */}
              <div className="mt-1 flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 rounded-full px-3 font-medium text-[13px] text-muted-foreground hover:text-foreground"
                  >
                    <AtSign className="h-3.5 w-3.5" />
                    Mention
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="mr-1 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Empty states */}
        <TabsContent
          value="notes"
          className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm"
        >
          <PenTool className="mb-3 h-8 w-8 opacity-30" />
          <p className="font-medium text-foreground">No notes yet</p>
          <p className="mt-1 max-w-[200px]">Highlight sections of the document to add notes here.</p>
        </TabsContent>
        <TabsContent
          value="details"
          className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm"
        >
          <FileText className="mb-3 h-8 w-8 opacity-30" />
          <p className="font-medium text-foreground">Document Properties</p>
          <p className="mt-1">Details will be extracted automatically.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

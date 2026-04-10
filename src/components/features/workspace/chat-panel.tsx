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
    <div className="bg-background text-foreground relative flex h-full flex-col">
      <Tabs defaultValue="chat" className="flex w-full flex-1 flex-col">
        <TabsList className="border-border bg-background text-muted-foreground relative z-10 h-14 w-full shrink-0 justify-start space-x-2 rounded-none border-b px-4 sm:px-6">
          <TabsTrigger
            value="chat"
            className="hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-4 text-[13px] font-semibold transition-colors data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-4 text-[13px] font-medium transition-colors data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Notes
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-4 text-[13px] font-medium transition-colors data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="chat"
          className="bg-background m-0 flex h-full flex-1 flex-col overflow-hidden p-0 outline-none"
        >
          {/* Chat header area */}
          <div className="text-foreground flex shrink-0 items-center justify-between px-6 py-4">
            <div className="hover:bg-muted -ml-3 flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[14px] font-semibold transition-colors">
              Current Session <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-6 py-2" ref={scrollRef}>
            <div className="flex flex-col gap-6 pb-4">
              {history.length === 0 && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Send a message to start chatting with{" "}
                  <span className="text-foreground font-semibold">{fileTitle}</span>.
                </div>
              )}

              {history.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "ai" ? (
                    <div className="border-primary/20 bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                      <Sparkles className="text-primary h-4 w-4" />
                    </div>
                  ) : (
                    <div className="bg-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                      <span className="text-background text-[11px] font-bold">ME</span>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                      msg.role === "ai"
                        ? "border-border bg-muted text-foreground rounded-2xl rounded-tl-sm border"
                        : "border-primary bg-primary text-primary-foreground rounded-2xl rounded-tr-sm border"
                    }`}
                  >
                    <p className="leading-[1.6] whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} className="h-1" />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-border bg-background z-10 mt-auto shrink-0 border-t p-4 sm:p-5">
            <div className="group border-input bg-background focus-within:border-ring focus-within:ring-ring flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all focus-within:ring-[2px]">
              {/* Context Tag */}
              <div className="flex items-center px-3 pt-3 pb-1">
                <div className="bg-secondary text-secondary-foreground flex max-w-full shrink-0 items-center gap-1.5 overflow-hidden rounded-md px-2.5 py-1 text-[12px] font-medium">
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
                className="text-foreground placeholder:text-muted-foreground max-h-[160px] min-h-[44px] w-full resize-none bg-transparent px-4 py-2 font-sans text-[14px] outline-none"
                rows={1}
              />

              {/* Bottom tools */}
              <div className="mt-1 flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-8 gap-1.5 rounded-full px-3 text-[13px] font-medium"
                  >
                    <AtSign className="h-3.5 w-3.5" />
                    Mention
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 mr-1 h-8 w-8 rounded-full shadow-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
          className="text-muted-foreground flex flex-1 flex-col items-center justify-center p-8 text-center text-sm"
        >
          <PenTool className="mb-3 h-8 w-8 opacity-30" />
          <p className="text-foreground font-medium">No notes yet</p>
          <p className="mt-1 max-w-[200px]">Highlight sections of the document to add notes here.</p>
        </TabsContent>
        <TabsContent
          value="details"
          className="text-muted-foreground flex flex-1 flex-col items-center justify-center p-8 text-center text-sm"
        >
          <FileText className="mb-3 h-8 w-8 opacity-30" />
          <p className="text-foreground font-medium">Document Properties</p>
          <p className="mt-1">Details will be extracted automatically.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

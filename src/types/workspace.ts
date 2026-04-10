export type FileType = "pdf" | "md" | "js" | "ts" | "txt";

export interface WorkspaceFile {
  id: string;
  title: string;
  type: FileType;
  date: string;
  size: string;
  content: string; // text content or URL for pdf
  authors?: string;
  viewed?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

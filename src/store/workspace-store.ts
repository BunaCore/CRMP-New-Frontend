import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ChatMessage, WorkspaceFile } from "@/types/workspace";

// Initial mock data that simulates our simulated backend or file storage
const MOCK_FILES: WorkspaceFile[] = [
  {
    id: "doc-1",
    title: "Collaborative Research Management",
    type: "pdf",
    date: "Today",
    size: "2.4 MB",
    content: "mock-pdf-url",
    authors: "Frezewed, et al.",
    viewed: "34 minutes ago",
  },
  {
    id: "doc-2",
    title: "data_processor",
    type: "ts",
    date: "March 16, 2026",
    size: "14 KB",
    content: `// Data Processing Module
export function processResearchData(rawData: any[]) {
  return rawData.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date().toISOString()
  }));
}

export const calculateMetrics = (data: any[]) => {
  const sum = data.reduce((acc, val) => acc + val.value, 0);
  return sum / data.length;
};
`,
    authors: "Dev Team",
    viewed: "March 16, 2026",
  },
  {
    id: "doc-3",
    title: "Environmentally Induced Transgenerational Epigenetics",
    type: "pdf",
    date: "November 20, 2025",
    size: "4.1 MB",
    content: "mock-pdf-url-2",
    authors: "Skinner, et al.",
  },
  {
    id: "doc-4",
    title: "Project Notes",
    type: "md",
    date: "November 20, 2025",
    size: "5.2 KB",
    content: `# Research Project Notes
    
## Phase 1 Objectives
- Identify core target demographics
- Compile historical epigenetic data
- Finalize the literature review 

## Next Steps
We need to coordinate with the data science team to set up our pipeline. I propose using the new \`data_processor.ts\` module.
`,
    authors: "Research Lead",
  },
];

interface WorkspaceState {
  files: WorkspaceFile[];
  selectedFileId: string | null;
  fileContents: Record<string, string>; // Local edits stored by ID
  chatHistories: Record<string, ChatMessage[]>; // Chat stored by file ID

  // Actions
  selectFile: (id: string | null) => void;
  updateFileContent: (id: string, newContent: string) => void;
  sendMessage: (fileId: string, text: string) => void;
  getFileById: (id: string) => WorkspaceFile | undefined;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      files: MOCK_FILES,
      selectedFileId: null,
      fileContents: {},
      chatHistories: {},

      selectFile: (id) => set({ selectedFileId: id }),

      updateFileContent: (id, newContent) =>
        set((state) => ({
          fileContents: {
            ...state.fileContents,
            [id]: newContent,
          },
        })),

      sendMessage: (fileId, text) => {
        const newMessage: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          role: "user",
          text,
          timestamp: new Date(),
        };

        set((state) => {
          const fileHistory = state.chatHistories[fileId] || [
            {
              id: "welcome-msg",
              role: "ai",
              text: `I've analyzed this document. How can I help you?`,
              timestamp: new Date(Date.now() - 10000), // a bit in the past
            },
          ];

          return {
            chatHistories: {
              ...state.chatHistories,
              [fileId]: [...fileHistory, newMessage],
            },
          };
        });

        // Simulate AI response slightly delayed based strictly on the request instructions (local history simulation)
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: Math.random().toString(36).substring(7),
            role: "ai",
            text: `(This is a locally simulated response. In a real app, this would be streamed from your AI backend). You said: "${text}"`,
            timestamp: new Date(),
          };

          set((state) => {
            const history = state.chatHistories[fileId] || [];
            return {
              chatHistories: {
                ...state.chatHistories,
                [fileId]: [...history, aiMessage],
              },
            };
          });
        }, 600);
      },

      getFileById: (id) => {
        const state = get();
        return state.files.find((f) => f.id === id);
      },
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({
        fileContents: state.fileContents,
        chatHistories: state.chatHistories,
      }), // only persist contents and chats
    },
  ),
);

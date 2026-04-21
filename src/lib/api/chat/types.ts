export interface Sender {
  id: string;
  name: string;
  avatar: string | null;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  createdAt: string;
  sender: Sender;
}

export interface ChatSummary {
  id: string;
  type: "group" | "dm";
  displayName: string;
  displayImage: string | null;
  unreadCount?: number;
  memberIds?: string[];
  otherMemberId?: string;
  lastMessage?: Message;
}

export interface ChatDetailsParticipant {
  id: string;
  name: string;
  email: string;
}

export interface ChatDetails {
  id: string;
  type: "group" | "dm";
  name: string;
  members: ChatDetailsParticipant[];
  createdAt: string;
}

export interface GetMessagesResponse {
  messages: Message[];
  nextCursor: string | null;
}

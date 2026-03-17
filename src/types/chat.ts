export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

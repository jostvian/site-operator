export type Role = "user" | "assistant";

export interface Message {
    id: string;
    role: Role;
    content: string;
    createdAt: number;
    isThinking?: boolean;
}

export interface ChatThread {
    id: string;
    messages: Message[];
    isRunning: boolean;
}

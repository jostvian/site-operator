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

export interface ConversationSummary {
    id: string;
    title: string;
}

/**
 * Representa el estado del agente y el contexto de la aplicación
 * donde se encuentra embebido el chat.
 */
export interface AgentState {
    /** Nombre del portal donde se ejecuta el chat */
    appName: string;
    /** Nombre de la página donde se está ejecutando */
    currentPage: string;
    /** Habilita la ventana de inspección */
    inspector?: boolean;
}

export interface InspectorEvent {
    event: string;
    content: any;
    time: string;
}

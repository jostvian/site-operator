import type { Message } from "@ag-ui/client";

export type { Message };

export type UIMessage = Message & {
    isThinking?: boolean;
    createdAt?: number;
};

export interface ChatThread {
    id: string;
    messages: UIMessage[];
    isRunning: boolean;
    title?: string;
}
export interface ConversationSummary {
    id: string;
    title: string;
}

export interface AppState {
    v: "1.1";

    location: {
        routeId?: string;
        path: string;
        params?: Record<string, string>;
        title?: string;
    };

    // qué acciones clickeables están disponibles AHORA en esta pantalla
    ui: {
        visibleClickTargetIds: string[];  // ["btn.createClient","lnk.export"]
    };

    focus?: {
        type: string;
        id: string;
        label?: string;
    };
}

/**
 * Representa el estado del agente y el contexto de la aplicación
 * donde se encuentra embebido el chat.
 * @deprecated Use AppContext for static info and AppState for dynamic info.
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
    content: unknown;

    time: string;
}

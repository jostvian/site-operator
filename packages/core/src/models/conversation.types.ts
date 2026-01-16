import type { Message } from "@ag-ui/core";


/**
 * Representa una conversación persistida en el sistema.
 * Extiende la funcionalidad de ChatThread con título y usuario.
 */
export interface Conversation {

    id: string;
    messages: Message[];
    isRunning: boolean;
    /** Título descriptivo de la conversación */
    title: string;
    /** ID del usuario propietario de la conversación */
    userId: string;
}

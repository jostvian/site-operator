import type { ChatThread } from "./chat.types";

/**
 * Representa una conversación persistida en el sistema.
 * Extiende la funcionalidad de ChatThread con título y usuario.
 */
export interface Conversation extends ChatThread {
    /** Título descriptivo de la conversación */
    title: string;
    /** ID del usuario propietario de la conversación */
    userId: string;
}

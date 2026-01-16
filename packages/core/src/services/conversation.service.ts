import type { Conversation } from "../models/conversation.types";

/**
 * Servicio para gestionar las conversaciones (threads) a través de un API externa.
 */
export class ConversationService {
    private baseUrl: string;

    constructor() {
        // La URL se resuelve en tiempo de compilación. Por defecto se usa http://localhost:8003
        const apiUrl = import.meta.env.VITE_CONVERSATIONS_API_URL || 'http://localhost:8003';
        this.baseUrl = `${apiUrl}/api/v2/conversations`;
    }

    /**
     * Inicializa la URL base del servicio.
     * @param apiUrl URL base del API de conversaciones (ej. http://localhost:8003)
     */
    initialize(apiUrl: string) {
        this.baseUrl = `${apiUrl}/api/v2/conversations`;
    }

    /**
     * Obtiene todas las conversaciones de un usuario.
     * @returns Promesa con el listado de conversaciones
     */
    async getConversations(): Promise<Conversation[]> {
        const response = await fetch(`${this.baseUrl}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch conversations: ${response.statusText}`);
        }
        return response.json();
    }

    /**
     * Crea una nueva conversación.
     * @param conversation Datos de la conversación a crear.
     * @returns Promesa con la conversación creada
     */
    async createConversation(conversation: Partial<Pick<Conversation, 'title'>>): Promise<Conversation> {
        const payload = {
            ...conversation,
            title: conversation.title || "Nueva conversación"
        };

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to create conversation: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Actualiza una conversación existente.
     * @param id ID de la conversación
     * @param conversation Datos parciales a actualizar
     * @returns Promesa con la conversación actualizada
     */
    async updateConversation(id: string, conversation: Partial<Conversation>): Promise<Conversation> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(conversation),
        });

        if (!response.ok) {
            throw new Error(`Failed to update conversation: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Elimina una conversación.
     * @param id ID de la conversación a eliminar
     */
    async deleteConversation(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete conversation: ${response.statusText}`);
        }
    }
}

export const conversationService = new ConversationService();

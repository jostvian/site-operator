import type { AgentState, Message, InspectorEvent } from "../models/chat.types";

/**
 * Servicio para gestionar la información de inspección del agente.
 * Mantiene un registro del contexto, mensajes y eventos de streaming.
 */
export class InspectorService extends EventTarget {
    private _context: AgentState | null = null;
    private _messages: Message[] = [];
    private _stream: InspectorEvent[] = [];

    get context() { return this._context; }
    get messages() { return this._messages; }
    get stream() { return this._stream; }

    /**
     * Actualiza el contexto actual.
     * @param context Nuevo contexto del agente.
     */
    setContext(context: AgentState | null) {
        this._context = context;
        this.notify();
    }

    /**
     * Actualiza la lista de mensajes.
     * @param messages Lista de mensajes del hilo.
     */
    setMessages(messages: Message[]) {
        this._messages = [...messages];
        this.notify();
    }

    /**
     * Agrega un nuevo evento al flujo de eventos.
     * @param event Nombre del evento.
     * @param content Contenido o detalle del evento.
     */
    addEvent(event: string, content: any) {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0]; // hh:mm:ss
        this._stream = [{ event, content, time }, ...this._stream].slice(0, 100); // Keep last 100
        this.notify();
    }

    /**
     * Limpia el flujo de eventos.
     */
    clearStream() {
        this._stream = [];
        this.notify();
    }

    private notify() {
        this.dispatchEvent(new CustomEvent('inspector-change'));
    }
}

export const inspectorService = new InspectorService();

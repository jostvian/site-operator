import { HttpAgent } from "@ag-ui/client";
import type { ChatThread, Message, AgentState } from "../models/chat.types";
import { generateId } from "../utils/id-generator";
import { ChatSubscriber } from "./chat.subscriber";
import { inspectorService } from "./inspector.service";
import { conversationService } from "./conversation.service";

export class ChatService extends EventTarget {
    private agent?: HttpAgent;
    private _thread: ChatThread = {
        id: "",
        messages: [],
        isRunning: false,
    };
    private _appContext: AgentState | null = null;

    private subscriber: ChatSubscriber;

    constructor() {
        super();
        this.subscriber = new ChatSubscriber(this);
    }

    /**
     * Inicializa el servicio de chat con una URL de backend y el nombre de la aplicación.
     * @param config Configuración de inicialización.
     */
    initialize(config: { backendUrl: string, appName: string, inspector?: boolean }) {
        this.agent = new HttpAgent({
            url: config.backendUrl,
        });
        this._appContext = {
            appName: config.appName,
            currentPage: 'home',
            inspector: config.inspector
        };
        inspectorService.setContext(this._appContext);
        inspectorService.setMessages(this._thread.messages);
    }

    get thread() {
        return this._thread;
    }

    /**
     * Establece el contexto de la aplicación para el agente.
     * Este contexto se envía en cada mensaje.
     * @param context El contexto de la aplicación (AgentState)
     */
    setAppContext(context: AgentState) {
        this._appContext = context;
        inspectorService.setContext(context);
        this.notify();
    }

    async sendMessage(content: string) {
        if (!this.agent) {
            console.error("ChatService not initialized. Call initialize() first.");
            return;
        }

        // Create conversation if it doesn't exist
        if (!this._thread.id) {
            try {
                const newConversation = await conversationService.createConversation({ title: content.slice(0, 30) + (content.length > 30 ? "..." : "") });
                this._thread.id = newConversation.id;
                this.agent.threadId = this._thread.id;
            } catch (error) {
                console.error("Failed to create conversation during sendMessage", error);
                return; // Stop if we can't create a conversation
            }
        }

        // Optimistic update
        const userMsg: Message = {
            id: generateId("message"),
            role: "user",
            content,
            createdAt: Date.now(),
        };

        this._thread.messages = [...this._thread.messages, userMsg];
        this._thread.isRunning = true;
        this.notify();

        try {
            // Configure agent (redundant but safe)
            this.agent.threadId = this._thread.id;


            // Add only the new message
            this.agent.addMessage({
                id: userMsg.id,
                role: userMsg.role,
                content: userMsg.content
            });

            // Run the agent with subscriber
            const contextItems = [
                {
                    value: new Date().toLocaleString(),
                    description: "Current date and time"
                }
            ];

            if (this._appContext) {
                contextItems.push({
                    value: JSON.stringify(this._appContext),
                    description: "AgentState"
                });
            }

            await this.agent.runAgent({
                context: contextItems
            }, this.subscriber);

        } catch (error) {
            console.error("Failed to send message", error);
            // Add error message to thread?
        } finally {
            this._thread.isRunning = false;
            this.notify();
        }
    }

    addPlaceholderMessage() {
        const placeholder: Message = {
            id: "thinking-placeholder",
            role: "assistant",
            content: "",
            createdAt: Date.now(),
            isThinking: true
        };
        this._thread.messages = [...this._thread.messages, placeholder];
        this.notify();
    }

    prepareMessageForStreaming(newId: string) {
        this._thread.messages = this._thread.messages.map(msg => {
            if (msg.isThinking) {
                return {
                    ...msg,
                    id: newId,
                    isThinking: false
                };
            }
            return msg;
        });
        this.notify();
    }

    appendMessageContent(id: string, content: string) {
        this._thread.messages = this._thread.messages.map(msg => {
            if (msg.id === id) {
                return {
                    ...msg,
                    content: msg.content + content
                };
            }
            return msg;
        });
        this.notify();
    }

    setMessages(messages: Message[]) {
        // Map external messages to our Message type if needed, or assume compatibility
        // Assuming strict compatibility for now
        this._thread.messages = messages as Message[];
        this.notify();
    }

    async startNewThread() {
        // Just reset locally. Conversation will be created on first message.
        this._thread = {
            id: "",
            messages: [],
            isRunning: false
        };

        if (this.agent) {
            this.agent.threadId = "";
        }

        this.notify();
    }

    private notify() {
        inspectorService.setMessages(this._thread.messages);
        this.dispatchEvent(new CustomEvent("state-change"));
    }
}

export const chatService = new ChatService();

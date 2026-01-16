import { HttpAgent } from "@ag-ui/client";
import type { ChatThread, Message, AgentState, ConversationSummary, AppState } from "../models/chat.types";
import type { AppContext } from "../models/portal.types";


import { generateId } from "../utils/id-generator";
import { ChatSubscriber } from "./chat.subscriber";
import { inspectorService } from "./inspector.service";

export class ChatService extends EventTarget {
    private agent?: HttpAgent;
    private _thread: ChatThread = {
        id: "",
        messages: [],
        isRunning: false,
    };
    private _conversations: ConversationSummary[] = [];
    private _appContext: AppContext | AgentState | null = null;
    private _appState: AppState = {
        v: "1.1",
        location: { path: "" },
        ui: { visibleClickTargetIds: [] }
    };


    private subscriber: ChatSubscriber;

    constructor() {
        super();
        this.subscriber = new ChatSubscriber(this);
    }

    /**
     * Inicializa el servicio de chat con las URLs necesarias y el nombre de la aplicación.
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

    get conversations() {
        return this._conversations;
    }

    /**
     * Establece el contexto de la aplicación para el agente.
     * Este contexto se envía en cada mensaje.
     * @param context El contexto de la aplicación (AgentState o AppContext)
     */
    setAppContext(context: AgentState | AppContext) {
        this._appContext = context;
        inspectorService.setContext({ context: this._appContext, state: this._appState });
        this.notify();
    }

    /**
     * Establece el estado dinámico de la aplicación.
     * @param state El estado completo de la aplicación.
     */
    setAppState(state: AppState) {
        this._appState = state;
        inspectorService.setContext({ context: this._appContext, state: this._appState });
        this.notify();
    }

    /**
     * Actualiza el estado dinámico de la aplicación de forma parcial.
     * @param partial El estado parcial de la aplicación.
     */
    updateAppState(partial: Partial<AppState>) {
        this._appState = { ...this._appState, ...partial };
        inspectorService.setContext({ context: this._appContext, state: this._appState });
        this.notify();
    }

    setAppLocation(location: AppState["location"]) {
        this._appState.location = location;
        inspectorService.setContext({ context: this._appContext, state: this._appState });
        this.notify();
    }

    setAppUI(ui: AppState["ui"]) {
        this._appState.ui = ui;
        inspectorService.setContext({ context: this._appContext, state: this._appState });
        this.notify();
    }

    setAppFocus(focus: AppState["focus"]) {
        this._appState.focus = focus;
        inspectorService.setContext({ context: this._appContext, state: this._appState });
        this.notify();
    }


    async sendMessage(content: string) {
        if (!this.agent) {
            console.error("ChatService not initialized. Call initialize() first.");
            return;
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
                const contextValue = typeof this._appContext === 'object' && 'v' in this._appContext
                    ? JSON.stringify(this._appContext)
                    : JSON.stringify(this._appContext);

                contextItems.push({
                    value: contextValue,
                    description: "AppContext"
                });
            }

            if (this._appState) {
                contextItems.push({
                    value: JSON.stringify(this._appState),
                    description: "AppState"
                });
            }

            this.agent.state = {
                appContext: this._appContext,
                appState: this._appState
            };

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

    /**
     * Refresca la lista de conversaciones desde el servicio de conversaciones.
     */
    async refreshConversations() {
        try {
            // const conversations = await conversationService.getConversations();
            // this._conversations = conversations.map(c => ({
            //     id: c.id,
            //     title: c.title
            // }));
            this.notify();
        } catch (error) {
            console.error("Failed to refresh conversations", error);
        }
    }

    private notify() {
        inspectorService.setMessages(this._thread.messages);
        this.dispatchEvent(new CustomEvent("state-change"));
    }
}

export const chatService = new ChatService();

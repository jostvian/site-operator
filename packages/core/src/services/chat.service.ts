import { HttpAgent, type Message } from "@ag-ui/client";
import type { ConversationSummary, AppState, UIMessage } from "../models/chat.types.js";
import type { AppContext } from "../models/portal.types";


import { generateId } from "../utils/id-generator";
import { ChatSubscriber } from "./chat.subscriber";
import { inspectorService } from "./inspector.service";
import { conversationService } from "./conversation.service";
import { chatPortalService } from "./chat-portal.service";

const threadIdPlaceHolder = "thread-placeholder";
const SESSION_THREAD_ID_KEY = "site-operator-thread-id";
export class ChatService extends EventTarget {
    private agent?: HttpAgent;
    private _conversations: ConversationSummary[] = [];
    private _appContext: AppContext | null = null;
    private _appState: AppState = {
        v: "1.1",
        location: { path: "" },
        ui: { visibleClickTargetIds: [] }
    };

    get isRunning() {
        return this.agent?.isRunning || false;
    }

    get messages() {
        return this.agent?.messages || [];
    }


    private subscriber: ChatSubscriber;

    constructor() {
        super();
        this.subscriber = new ChatSubscriber(this);

        // Listen for context registration from other parts of the app
        chatPortalService.addEventListener('portal-registered', (e: Event) => {
            const detail = (e as CustomEvent<AppContext>).detail;
            console.log('ChatService: Portal context detected', detail);
            this.setAppContext(detail);
        });
    }

    /**
     * Inicializa el servicio de chat con las URLs necesarias y el nombre de la aplicación.
     * @param config Configuración de inicialización.
     */
    async initialize(config: { backendUrl: string, conversationUrl: string, appName: string, inspector?: boolean }) {
        const storedThreadId = sessionStorage.getItem(SESSION_THREAD_ID_KEY);
        this.agent = new HttpAgent({
            url: config.backendUrl,
            threadId: storedThreadId || threadIdPlaceHolder,
        });
        conversationService.initialize(config.conversationUrl);

        // Prioritize already registered portal context if available
        if (chatPortalService.context) {
            this._appContext = chatPortalService.context;
        } else {
            this._appContext = {
                v: "1.1",
                site: {
                    name: config.appName,
                    locale: window.navigator.language || window.navigator.languages[0] || "en",
                },
            };
        }

        if (storedThreadId) {
            await this.loadConversation(storedThreadId);
        }

        inspectorService.setContext(this._appContext);
        inspectorService.setState(this._appState);
        inspectorService.setMessages(this.agent?.messages || []);
    }

    /**
     * Carga una conversación existente por su ID.
     * @param id ID de la conversación a cargar.
     */
    async loadConversation(id: string) {
        try {
            const conversation = await conversationService.getConversation(id);
            if (this.agent) {
                this.agent.threadId = conversation.id;
                this.agent.messages = (conversation.messages || []) as UIMessage[];
                sessionStorage.setItem(SESSION_THREAD_ID_KEY, conversation.id);
            }
            this.notify();
        } catch (error) {
            console.error("Failed to load conversation", error);
            // Si falla la carga, volvemos al estado inicial
            if (this.agent) {
                this.agent.threadId = threadIdPlaceHolder;
                this.agent.messages = [];
                sessionStorage.removeItem(SESSION_THREAD_ID_KEY);
            }
            this.notify();
        }
    }

    get conversations() {
        return this._conversations;
    }

    /**
     * Establece el contexto de la aplicación para el agente.
     * Este contexto se envía en cada mensaje.
     * @param context El contexto de la aplicación (AgentState o AppContext)
     */
    setAppContext(context: AppContext) {
        this._appContext = context;
        inspectorService.setContext(this._appContext);
        this.notify();
    }



    /**
     * Establece el estado dinámico de la aplicación.
     * @param state El estado completo de la aplicación.
     */
    setAppState(state: AppState) {
        this._appState = state;
        inspectorService.setState(this._appState);
        this.notify();
    }

    /**
     * Actualiza el estado dinámico de la aplicación de forma parcial.
     * @param partial El estado parcial de la aplicación.
     */
    updateAppState(partial: Partial<AppState>) {
        this._appState = { ...this._appState, ...partial };
        this.notify();
    }

    setAppLocation(location: AppState["location"]) {
        this._appState.location = location;
        this.notify();
    }

    setAppUI(ui: AppState["ui"]) {
        this._appState.ui = ui;
        this.notify();
    }

    setAppFocus(focus: AppState["focus"]) {
        this._appState.focus = focus;
        this.notify();
    }


    async sendMessage(content: string, role: "developer" | "user" | "assistant" | "system" | "tool" | "activity" = "user") {
        if (!this.agent) {
            console.error("ChatService not initialized. Call initialize() first.");
            return;
        }

        // Optimistic update
        const id = generateId("message");
        const createdAt = Date.now();
        let userMsg: UIMessage;

        switch (role) {
            case "activity":
                userMsg = { id, role: "activity", activityType: "message", content: { text: content }, createdAt };
                break;
            case "tool":
                userMsg = { id, role: "tool", content, toolCallId: generateId("toolCall"), createdAt };
                break;
            case "user":
                userMsg = { id, role: "user", content, createdAt };
                break;
            case "assistant":
                userMsg = { id, role: "assistant", content, createdAt };
                break;
            case "system":
                userMsg = { id, role: "system", content, createdAt };
                break;
            case "developer":
                userMsg = { id, role: "developer", content, createdAt };
                break;
        }



        this.notify();

        try {
            if (this.agent?.threadId == threadIdPlaceHolder)
                await this._ensureConversation();
            // Add only the new message
            this.agent.addMessage(userMsg as Message);

            this.agent.state = {
                appContext: this._appContext,
                appState: this._appState
            };



            await this.agent.runAgent({ tools: [] }, this.subscriber);



        } catch (error) {
            console.error("Failed to send message", error);
            // Add error message to thread?
        } finally {
            this.notify();
        }
    }

    async _ensureConversation() {
        if (!this.agent) {
            throw new Error("Agent not initialized");
        }
        if (this.agent?.threadId == threadIdPlaceHolder) {
            const conversation = await conversationService.createConversation({
                appContext: this._appContext || undefined
            });
            this.agent.threadId = conversation.id;
            sessionStorage.setItem(SESSION_THREAD_ID_KEY, conversation.id);
        }
    }

    addPlaceholderMessage() {
        if (!this.agent) {
            throw new Error("Agent not initialized");
        }
        const placeholder: UIMessage = {
            id: "thinking-placeholder",
            role: "assistant",
            content: "",
            createdAt: Date.now(),
            isThinking: true
        };
        this.agent.messages = [...this.agent.messages, placeholder];
        this.notify();
    }

    prepareMessageForStreaming(newId: string) {
        if (!this.agent) {
            throw new Error("Agent not initialized");
        }
        this.agent.messages = this.agent.messages.map(msg => {
            if (msg.id === "thinking-placeholder" && this.isRunning) {
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
        if (!this.agent) {
            throw new Error("Agent not initialized");
        }
        this.agent.messages = this.agent.messages.map(msg => {
            if (msg.id === id && typeof msg.content === 'string') {
                return {
                    ...msg,
                    content: (msg.content || '') + content
                } as UIMessage;
            }
            return msg;
        });
        this.notify();
    }

    setMessages(messages: Message[]) {
        if (!this.agent) {
            throw new Error("Agent not initialized");
        }
        // Map external messages to our Message type if needed, or assume compatibility
        // Assuming strict compatibility for now
        this.agent.messages = messages as UIMessage[];
        this.notify();
    }

    async startNewThread() {
        sessionStorage.removeItem(SESSION_THREAD_ID_KEY);
        if (this.agent) {
            this.agent.threadId = threadIdPlaceHolder;
            this.agent.messages = [];
            this.agent.isRunning = false;
        }

        this.notify();
    }

    /**
     * Refresca la lista de conversaciones desde el servicio de conversaciones.
     */
    async refreshConversations() {
        try {
            const conversations = await conversationService.getConversations();
            this._conversations = conversations.map(c => ({
                id: c.id,
                title: c.title
            }));
            this.notify();
        } catch (error) {
            console.error("Failed to refresh conversations", error);
        }
    }

    private notify() {
        inspectorService.setMessages(this.agent?.messages || []);
        inspectorService.setState(this._appState);
        this.dispatchEvent(new CustomEvent("state-change"));
    }
}

export const chatService = new ChatService();

import { HttpAgent } from "@ag-ui/client";
import type { ChatThread, Message } from "../models/chat.types";
import { generateId } from "../utils/id-generator";
import { ChatSubscriber } from "./chat.subscriber";

export class ChatService extends EventTarget {
    private agent?: HttpAgent;
    private _thread: ChatThread = {
        id: generateId("thread"),
        messages: [],
        isRunning: false,
    };

    private subscriber: ChatSubscriber;

    constructor() {
        super();
        this.subscriber = new ChatSubscriber(this);
    }

    initialize(config: { backendUrl: string }) {
        this.agent = new HttpAgent({
            url: config.backendUrl,
        });
    }

    get thread() {
        return this._thread;
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
            // Configure agent
            this.agent.threadId = this._thread.id;

            // Add only the new message
            this.agent.addMessage({
                id: userMsg.id,
                role: userMsg.role,
                content: userMsg.content
            });

            // Run the agent with subscriber
            await this.agent.runAgent({}, this.subscriber);

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

    startNewThread() {
        this._thread = {
            id: generateId("thread"),
            messages: [],
            isRunning: false
        };
        this.notify();
    }

    private notify() {
        this.dispatchEvent(new CustomEvent("state-change"));
    }
}

export const chatService = new ChatService();

import { HttpAgent } from "@ag-ui/client";
import type { ChatThread, Message } from "../models/chat.types";
import { generateId } from "../utils/id-generator";

export class ChatService extends EventTarget {
    private agent: HttpAgent;
    private _thread: ChatThread = {
        id: generateId("thread"),
        messages: [],
        isRunning: false,
    };

    constructor() {
        super();
        this.agent = new HttpAgent({
            url: 'http://localhost:3000/api/agent', // TODO: Make configurable
        });
    }

    get thread() {
        return this._thread;
    }

    async sendMessage(content: string) {
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

            // Run the agent
            const result = await this.agent.runAgent();

            // Basic handling of result - assuming it returns the new message(s)
            // Adjust based on actual HttpAgent return type which I haven't fully inspected
            // For now, let's mock the response part if agent run doesn't update state directly
            // The HttpAgent usually returns an observable or a promise with events. 
            // Based on the d.ts, runAgent returns RunAgentResult.

            // Temporarily:
            // Mock response to ensure UI works while I figure out the exact event stream handling
            const botMsg: Message = {
                id: generateId("message"),
                role: "assistant",
                content: "Response from agent (mock/integration pending)", // result.messages.last().content
                createdAt: Date.now()
            };

            this._thread.messages = [...this._thread.messages, botMsg];

        } catch (error) {
            console.error("Failed to send message", error);
            // Add error message to thread?
        } finally {
            this._thread.isRunning = false;
            this.notify();
        }
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

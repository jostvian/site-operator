import type { ChatController } from 'site-operator';

declare module 'site-operator' {
    interface AgentChat {
        readonly controller: ChatController;
    }
}

declare global {
    interface HTMLElementEventMap {
        'controller-ready': CustomEvent<ChatController>;
    }
}

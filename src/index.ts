import './components/agent-chat';


export * from './components/agent-chat';
export * from './services/chat-portal.service';
export * from './models/portal.types';

/**
 * Mounts the Agent Chat component to a target element.
 * @param element The DOM element to mount the chat into.
 * @param options Configuration options for the chat.
 */
export function mount(element: HTMLElement, options: any = {}) {
    const chat = document.createElement('agent-chat');

    // Apply options if any (assuming AgentChat has properties we can set)
    // For now dealing with the component as is.
    Object.keys(options).forEach(key => {
        if (key in chat) {
            // @ts-ignore
            chat[key] = options[key];
        }
    });

    element.appendChild(chat);
    return chat;
}

/**
 * Registers the web component.
 * (It's already registered by import, but this can be a safe-guard re-export or initialization function)
 */
export function register() {
    // verify if already defined? 
    // currently agent-chat.ts likely calls customElements.define side-effect.
}

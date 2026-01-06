import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { styles } from './sami-chat.styles';
import './chat-header';
import './chat-thread';
import './chat-composer';
import { chatService } from '../services/chat.service';
import type { ChatThread } from '../models/chat.types';


@customElement('sami-chat')
export class SamiChat extends LitElement {
    static styles = styles;

    @state() private _thread: ChatThread = chatService.thread;

    constructor() {
        super();
        // Subscribe to service updates
        chatService.addEventListener('state-change', () => {
            this._thread = { ...chatService.thread }; // Spread to trigger reactivity
        });
    }

    private _handleSend(e: CustomEvent) {
        chatService.sendMessage(e.detail.content);
    }

    private _handleNewThread() {
        chatService.startNewThread();
    }

    render() {
        return html`
      <div class="chat-layout">
        <sami-chat-header @new-thread="${this._handleNewThread}"></sami-chat-header>
        <sami-chat-thread .messages="${this._thread.messages}" ?isRunning="${this._thread.isRunning}"></sami-chat-thread>
        <sami-chat-composer ?isRunning="${this._thread.isRunning}" @send="${this._handleSend}"></sami-chat-composer>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'sami-chat': SamiChat;
    }
}

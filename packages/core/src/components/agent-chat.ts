import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { styles } from './agent-chat.styles';
import './chat-header';
import './chat-thread';
import './chat-composer';
import type { AgentState } from '../models/chat.types';
import './chat-history-list';
import './inspector-window';
import { ChatController } from '../hooks/chat.controller';
import { ToolIcon } from '../icons';

import { fetchInterceptorService } from '../services/fetch-interceptor.service';

@customElement('agent-chat')
export class AgentChat extends LitElement {
    static styles = styles;

    private _chatController = new ChatController(this);
    @property({ type: String, attribute: 'backend-url' }) backendUrl = 'http://localhost:8001/ag_ui';
    @property({ type: String, attribute: 'app-name' }) appName = 'Lit-Chat-App';

    @property({ type: String, attribute: 'agent-avatar' }) agentAvatar = '';
    @property({ type: Boolean, attribute: 'interceptor' }) interceptor = false;

    @state() private _historyOpen = false;
    @state() private _inspectorOpen = false;
    @state() private _inspectorEnabled = false;

    willUpdate(changedProperties: Map<string, any>) {
        if (changedProperties.has('backendUrl') || changedProperties.has('appName')) {
            this._chatController.initialize({
                backendUrl: this.backendUrl,
                appName: this.appName,
                inspector: this.hasAttribute('inspector') || (this as any).inspector
            });
            this._inspectorEnabled = this.hasAttribute('inspector') || (this as any).inspector;
        }

        if (changedProperties.has('interceptor')) {
            if (this.interceptor) {
                this.enableFetchInterceptor();
            } else {
                fetchInterceptorService.destroy();
            }
        }
    }

    /**
     * Enables the fetch interceptor for development purposes.
     * This will only work if the application is running in development mode.
     */
    public enableFetchInterceptor() {
        if (import.meta.env.DEV) {
            fetchInterceptorService.init();
        } else {
            console.warn('Fetch interceptor is only available in development mode.');
        }
    }

    private _handleSend(e: CustomEvent) {
        this._chatController.sendMessage(e.detail.content);
    }

    private _handleNewThread() {
        this._chatController.startNewThread();
    }

    /**
     * API Pública para establecer el contexto de la aplicación.
     * @param appContext Contexto de la aplicación (AgentState)
     */
    public setAppContext(appContext: AgentState) {
        this._chatController.setAppContext(appContext);
    }

    private _toggleHistory() {
        this._historyOpen = !this._historyOpen;
        if (this._historyOpen) {
            this._chatController.refreshConversations();
        }
    }

    private _handleSelectThread(e: CustomEvent) {
        console.log('Selected conversation:', e.detail.conversation);
        this._historyOpen = false;
    }

    private _toggleInspector() {
        this._inspectorOpen = !this._inspectorOpen;
    }

    render() {
        return html`
      <div class="chat-layout">
        <agent-chat-header 
            @new-thread="${this._handleNewThread}"
            @toggle-history="${this._toggleHistory}"
        ></agent-chat-header>
        <agent-chat-history-list 
            .conversations="${this._chatController.conversations}" 
            ?open="${this._historyOpen}"
            @select-thread="${this._handleSelectThread}"
        ></agent-chat-history-list>
        <agent-chat-thread 
            .messages="${this._chatController.thread.messages}" 
            ?isRunning="${this._chatController.thread.isRunning}"
            .agentAvatar="${this.agentAvatar}">
        </agent-chat-thread>
        <agent-chat-composer ?isRunning="${this._chatController.thread.isRunning}" @send="${this._handleSend}"></agent-chat-composer>

        ${this._inspectorEnabled ? html`
          <button class="inspector-toggle" @click="${this._toggleInspector}" title="Inspector">
            ${ToolIcon}
          </button>
        ` : ''}

        ${this._inspectorOpen ? html`
          <agent-inspector-window @close="${this._toggleInspector}"></agent-inspector-window>
        ` : ''}
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'agent-chat': AgentChat;
    }
}

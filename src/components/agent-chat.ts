import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { styles } from './agent-chat.styles';
import './chat-header';
import './chat-thread';
import './chat-composer';
import type { ConversationSummary, AgentState } from '../models/chat.types';
import './chat-history-list';
import { ChatController } from '../hooks/chat.controller';


@customElement('agent-chat')
export class AgentChat extends LitElement {
    static styles = styles;

    private _chatController = new ChatController(this);
    @property({ type: String, attribute: 'backend-url' }) backendUrl = 'http://localhost:8001/ag_ui';

    @property({ type: String, attribute: 'agent-avatar' }) agentAvatar = '';

    @state() private _historyOpen = false;
    @state() private _conversations: ConversationSummary[] = [
        { id: '1', title: 'Planificación de Proyecto' },
        { id: '2', title: 'Consultas de API' },
        { id: '3', title: 'Ideas de Diseño' }
    ];

    willUpdate(changedProperties: Map<string, any>) {
        if (changedProperties.has('backendUrl')) {
            this._chatController.initialize({ backendUrl: this.backendUrl });
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
    }

    private _handleSelectThread(e: CustomEvent) {
        console.log('Selected conversation:', e.detail.conversation);
        this._historyOpen = false;
    }

    render() {
        return html`
      <div class="chat-layout">
        <agent-chat-header 
            @new-thread="${this._handleNewThread}"
            @toggle-history="${this._toggleHistory}"
        ></agent-chat-header>
        <agent-chat-history-list 
            .conversations="${this._conversations}" 
            ?open="${this._historyOpen}"
            @select-thread="${this._handleSelectThread}"
        ></agent-chat-history-list>
        <agent-chat-thread 
            .messages="${this._chatController.thread.messages}" 
            ?isRunning="${this._chatController.thread.isRunning}"
            .agentAvatar="${this.agentAvatar}">
        </agent-chat-thread>
        <agent-chat-composer ?isRunning="${this._chatController.thread.isRunning}" @send="${this._handleSend}"></agent-chat-composer>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'agent-chat': AgentChat;
    }
}

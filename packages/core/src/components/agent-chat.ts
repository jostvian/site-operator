import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { styles } from './agent-chat.styles';
import './chat-header';
import './chat-thread';
import './chat-composer';
import '@a2ui/lit/ui';
import './a2ui-theme-provider';
import type { AppContext } from "../models/portal.types.js";
import type { AppState } from "../models/chat.types.js";

import './chat-history-list';

import './inspector-window';
import { ChatController } from '../hooks/chat.controller';
import { ToolIcon } from '../icons';

import { fetchInterceptorService } from '../services/fetch-interceptor.service';

@customElement('agent-chat')
export class AgentChat extends LitElement {
    static styles = styles;

    private _chatController = new ChatController(this);
    @property({ type: String, attribute: 'backend-url' }) backendUrl = '/ag_ui';
    @property({ type: String, attribute: 'app-name' }) appName = 'Lit-Chat-App';
    @property({ type: String, attribute: 'conversation-url' }) conversationUrl = '';
    @property({ type: String, attribute: 'agent-avatar' }) agentAvatar = '';
    @property({ type: String, attribute: 'disclaimer' }) disclaimer = 'Agent puede cometer errores. Verifica la información importante.';
    @property({ type: String, attribute: 'empty-text' }) emptyText = '¿En qué puedo ayudarte hoy?';
    @property({ type: String, attribute: 'placeholder' }) placeholder = 'Enviar un mensaje a Agent';
    @property({ type: String, attribute: 'header-title' }) headerTitle = 'Agent';
    @property({ type: Boolean, attribute: 'hide-header' }) hideHeader = false;
    @property({ type: Boolean, attribute: 'interceptor' }) interceptor = false;

    @state() private _historyOpen = false;
    @state() private _inspectorOpen = false;
    @state() private _inspectorEnabled = false;

    willUpdate(changedProperties: Map<string, any>) {

        if (changedProperties.has('interceptor')) {
            if (this.interceptor) {
                this.enableFetchInterceptor();
            } else {
                fetchInterceptorService.destroy();
            }
        }
        if (changedProperties.has('backendUrl')
            || changedProperties.has('appName')
            || changedProperties.has('conversationUrl')) {
            this._chatController.initialize({
                backendUrl: this.backendUrl,
                appName: this.appName,
                conversationUrl: this.conversationUrl,
                inspector: this.hasAttribute('inspector') || (this as any).inspector
            });
            this._inspectorEnabled = this.hasAttribute('inspector') || (this as any).inspector;
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
     * @param appContext Contexto de la aplicación (AgentState o AppContext)
     */
    public setAppContext(appContext: AppContext) {
        this._chatController.setAppContext(appContext);
    }

    /**
     * API Pública para establecer el estado dinámico de la aplicación.
     * @param appState Estado dinámico de la aplicación.
     */
    public setAppState(appState: AppState) {
        this._chatController.setAppState(appState);
    }

    public setAppLocation(location: AppState["location"]) {
        this._chatController.setAppLocation(location);
    }

    public setAppUI(ui: AppState["ui"]) {
        this._chatController.setAppUI(ui);
    }

    public setAppFocus(focus: AppState["focus"]) {
        this._chatController.setAppFocus(focus);
    }



    private _toggleHistory() {
        this._historyOpen = !this._historyOpen;
        if (this._historyOpen) {
            this._chatController.refreshConversations();
        }
    }

    private _handleSelectThread(e: CustomEvent) {
        console.log('Selected conversation:', e.detail.conversation);
        this._chatController.loadConversation(e.detail.conversation.id);
        this._historyOpen = false;
    }

    private _toggleInspector() {
        this._inspectorOpen = !this._inspectorOpen;
    }

    render() {
        return html`
      <div class="chat-layout">
        ${!this.hideHeader ? html`
            <agent-chat-header 
                .title="${this.headerTitle}"
                @new-thread="${this._handleNewThread}"
                @toggle-history="${this._toggleHistory}"
            ></agent-chat-header>
        ` : ''}
        <agent-chat-history-list 
            .conversations="${this._chatController.conversations}" 
            ?open="${this._historyOpen}"
            @select-thread="${this._handleSelectThread}"
        ></agent-chat-history-list>
        <agent-chat-thread 
            .messages="${this._chatController.messages}" 
            ?isRunning="${this._chatController.isRunning}"
            .agentAvatar="${this.agentAvatar}"
            .emptyText="${this.emptyText}">
        </agent-chat-thread>
        <agent-chat-composer 
            ?isRunning="${this._chatController.isRunning}" 
            .disclaimer="${this.disclaimer}"
            .placeholder="${this.placeholder}"
            @send="${this._handleSend}">
        </agent-chat-composer>

        ${this._inspectorEnabled ? html`
          <button class="inspector-toggle" @click="${this._toggleInspector}" title="Inspector">
            ${ToolIcon}
          </button>
        ` : ''}

        ${this._inspectorOpen ? html`
          <agent-inspector-window 
            @close="${this._toggleInspector}"
            @context-update="${this._handleContextUpdate}"
            @state-update="${this._handleStateUpdate}"
          ></agent-inspector-window>
        ` : ''}
      </div>
    `;
    }

    private _handleContextUpdate(e: CustomEvent) {
        this.setAppContext(e.detail);
    }

    private _handleStateUpdate(e: CustomEvent) {
        this.setAppState(e.detail);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'agent-chat': AgentChat;
    }
}

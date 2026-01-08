import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './chat-history-list.styles';
import type { ConversationSummary } from '../models/chat.types';

@customElement('sami-chat-history-list')
export class ChatHistoryList extends LitElement {
    static styles = styles;

    @property({ type: Array }) conversations: ConversationSummary[] = [];
    @property({ type: Boolean, reflect: true }) open = false;

    private _handleSelect(conversation: ConversationSummary) {
        this.dispatchEvent(new CustomEvent('select-thread', {
            detail: { conversation },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="header">
                Conversaciones
            </div>
            <ul class="list">
                ${this.conversations.length === 0
                ? html`<div class="empty-state">No hay conversaciones recientes</div>`
                : this.conversations.map(conv => html`
                        <li class="item" @click="${() => this._handleSelect(conv)}">
                            ${conv.title}
                        </li>
                    `)}
            </ul>
        `;
    }
}

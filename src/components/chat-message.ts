import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './chat-message.styles';
import type { Message } from '../models/chat.types';
import './ui/icon-button';
import { CopyIcon, ReloadIcon } from '../icons';

@customElement('sami-chat-message')
export class ChatMessage extends LitElement {
    static styles = styles;

    @property({ type: Object }) message!: Message;
    @property({ type: Boolean }) isLast = false;

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has('message')) {
            this.setAttribute('role', this.message.role);
            this.requestUpdate();
        }
    }

    private _handleCopy() {
        navigator.clipboard.writeText(this.message.content);
        // TODO: Show copied feedback
    }

    private _handleReload() {
        this.dispatchEvent(new CustomEvent('reload-message', { detail: { id: this.message.id }, bubbles: true, composed: true }));
    }

    render() {
        const isUser = this.message.role === 'user';

        return html`
      <div class="message-container">
        ${!isUser ? html`
          <div class="avatar">C</div>
        ` : ''}
        
        <div class="content-wrapper">
          <div class="bubble">
            ${this.message.content}
          </div>

          ${!isUser ? html`
             <div class="actions">
                <sami-icon-button tooltip="Copy" @click="${this._handleCopy}">
                    ${CopyIcon}
                </sami-icon-button>
                <sami-icon-button tooltip="Reload" @click="${this._handleReload}">
                    ${ReloadIcon}
                </sami-icon-button>
             </div>
          ` : ''}
        </div>
      </div>
    `;
    }
}

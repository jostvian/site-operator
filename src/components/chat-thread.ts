import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './chat-thread.styles';
import type { Message } from '../models/chat.types';
import './chat-message';

@customElement('sami-chat-thread')
export class ChatThread extends LitElement {
  static styles = styles;

  @property({ type: Array }) messages: Message[] = [];
  @property({ type: Boolean }) isRunning = false;
  @property({ type: String }) agentAvatar = '';

  // listElement query removed as it was unused in logic (scrollToBottom uses querySelector directly)

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('messages')) {
      this.scrollToBottom();
    }
  }

  async scrollToBottom() {
    await this.updateComplete;
    const lastMessage = this.shadowRoot?.querySelector('sami-chat-message:last-of-type');
    lastMessage?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  render() {
    if (this.messages.length === 0) {
      return html`
            <div class="empty-state">
                ${this.agentAvatar
          ? html`<img src="${this.agentAvatar}" alt="Agent Avatar" class="empty-avatar-img">`
          : html`<div class="empty-avatar">SM</div>`
        }
                <p class="empty-text">¿Cómo puedo ayudarte hoy?</p>
            </div>
        `;
    }

    return html`
      <div class="messages-list">
        ${this.messages.map((msg, index) => html`
          <sami-chat-message 
            .message=${msg} 
            .isLast=${index === this.messages.length - 1}
            .isStreaming=${this.isRunning && index === this.messages.length - 1}
            .agentAvatar="${this.agentAvatar}">
          </sami-chat-message>
        `)}
      </div>
    `;
  }
}

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './chat-thread.styles';
import type { UIMessage } from '../models/chat.types';
import './chat-message';
import { a2uiService } from '../services/a2ui.service';

@customElement('agent-chat-thread')
export class ChatThread extends LitElement {
  static styles = styles;

  @property({ type: Array }) messages: UIMessage[] = [];
  @property({ type: Boolean }) isRunning = false;
  @property({ type: String }) agentAvatar = '';
  @property({ type: String }) emptyText = '';

  // listElement query removed as it was unused in logic (scrollToBottom uses querySelector directly)

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('messages')) {
      a2uiService.processMessages(this.messages);
      this.scrollToBottom();
    }
  }

  async scrollToBottom() {
    await this.updateComplete;
    const lastMessage = this.shadowRoot?.querySelector('agent-chat-message:last-of-type');
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
                <p class="empty-text">${this.emptyText}</p>
            </div>
        `;
    }

    return html`
      <div class="messages-list">
        ${this.messages
        .filter(msg => {
          // 1. A2UI Messages: show if they have content to render (not just beginRendering)
          if (a2uiService.isA2UIMessage(msg)) {
            return !a2uiService.isBeginRenderingOnly(msg);
          }

          // 2. User and Assistant messages: always show
          if (msg.role === 'user' || msg.role === 'assistant') {
            return true;
          }

          // 3. Tool results: hide from UI (intermediate tech logs)
          if (msg.role === 'tool') {
            return false;
          }

          // 4. Activity messages: hide if they weren't matched as A2UI above
          if (msg.role === 'activity') {
            return false;
          }

          return true;
        })
        .map((msg, index, filteredArr) => html`
          <agent-chat-message 
            .message=${msg} 
            .isLast=${index === filteredArr.length - 1}
            .isStreaming=${this.isRunning && index === filteredArr.length - 1}
            .agentAvatar="${this.agentAvatar}">
          </agent-chat-message>
        `)}
      </div>
    `;
  }
}

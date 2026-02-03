import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './chat-message.styles';
import type { UIMessage } from '../models/chat.types';
import './ui/icon-button';
import { CopyIcon, ReloadIcon } from '../icons';

import { a2uiService } from '../services/a2ui.service';

@customElement('agent-chat-message')
export class ChatMessage extends LitElement {
  static styles = styles;

  @property({ type: Object }) message!: UIMessage;
  @property({ type: Boolean }) isLast = false;
  @property({ type: Boolean }) isStreaming = false;
  @property({ type: String }) agentAvatar = '';

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('message')) {
      this.setAttribute('role', this.message.role);
      this.requestUpdate();
    }
  }

  private _handleCopy() {
    const textToCopy = typeof this.message.content === 'string'
      ? this.message.content
      : JSON.stringify(this.message.content || '');
    navigator.clipboard.writeText(textToCopy);
    // TODO: Show copied feedback
  }

  private _handleReload() {
    this.dispatchEvent(new CustomEvent('reload-message', { detail: { id: this.message.id }, bubbles: true, composed: true }));
  }

  render() {
    const isUser = this.message.role === 'user';
    const isA2UI = a2uiService.isA2UIMessage(this.message);

    if (isA2UI) {
      // Obtenemos solo los payloads de este mensaje para filtrar qué superficies mostrar
      const messagePayloads = a2uiService.getA2UIPayloads(this.message);
      const messageSurfaceIds = new Set(
        messagePayloads
          .map(p => (p.beginRendering || p.surfaceUpdate || p.dataModelUpdate || p.deleteSurface)?.surfaceId)
          .filter(Boolean)
      );

      const processor = a2uiService.processor;
      const surfaces = Array.from(processor.getSurfaces().entries())
        .filter(([id]) => messageSurfaceIds.has(id));

      if (surfaces.length > 0) {
        return html`
          <div class="message-container activity">
            ${this.agentAvatar
            ? html`<img src="${this.agentAvatar}" class="avatar-img" alt="AI">`
            : html`<div class="avatar">C</div>`
          }
            <div class="content-wrapper">
              ${surfaces.map(([surfaceId, surface]) => html`
                  <a2ui-theme-provider
                    .surfaceId="${surfaceId}"
                    .processor="${processor}"
                    .surface="${surface}"
                    .enableCustomElements="${true}"
                  ></a2ui-theme-provider>
                `)}
              <div class="debug-id">${this.message.id}</div>
            </div>
          </div>
        `;
      }
    }

    return html`
      <div class="message-container">
        ${!isUser ? html`
            ${this.agentAvatar
          ? html`<img src="${this.agentAvatar}" class="avatar-img" alt="AI">`
          : html`<div class="avatar">C</div>`
        }
        ` : ''}
        
        <div class="content-wrapper">
          <div class="bubble ${this.isStreaming ? 'streaming' : ''}">${this.message.isThinking
        ? html`
                <div class="typing-indicator">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
              `
        : this.message.content}</div>
          <div class="debug-id">${this.message.id}</div>

          ${!isUser ? html`
             <div class="actions">
                <agent-icon-button tooltip="Copy" @click="${this._handleCopy}">
                    ${CopyIcon}
                </agent-icon-button>
                <agent-icon-button tooltip="Reload" @click="${this._handleReload}">
                    ${ReloadIcon}
                </agent-icon-button>
             </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './chat-header.styles';
import './ui/icon-button';
import { PlusIcon, HistoryIcon } from '../icons';

@customElement('agent-chat-header')
export class ChatHeader extends LitElement {
  static styles = styles;

  @property({ type: String }) title = 'Agent Chat';

  private _handleNewThread() {
    this.dispatchEvent(new CustomEvent('new-thread', { bubbles: true, composed: true }));
  }

  private _handleToggleHistory() {
    this.dispatchEvent(new CustomEvent('toggle-history', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <header class="header">
        <h1>${this.title}</h1>
        <div class="actions">
            <agent-icon-button tooltip="Conversaciones" @click="${this._handleToggleHistory}">
                ${HistoryIcon}
            </agent-icon-button>
            <agent-icon-button tooltip="Nuevo Chat" @click="${this._handleNewThread}">
                ${PlusIcon}
            </agent-icon-button>
        </div>
      </header>
    `;
  }
}

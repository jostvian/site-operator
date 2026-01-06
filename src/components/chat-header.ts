import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './chat-header.styles';
import './ui/icon-button';
import { PlusIcon } from '../icons';

@customElement('sami-chat-header')
export class ChatHeader extends LitElement {
    static styles = styles;

    @property({ type: String }) title = 'Sami Chat';

    private _handleNewThread() {
        this.dispatchEvent(new CustomEvent('new-thread', { bubbles: true, composed: true }));
    }

    render() {
        return html`
      <header class="header">
        <h1>${this.title}</h1>
        <sami-icon-button tooltip="Nuevo Chat" @click="${this._handleNewThread}">
          ${PlusIcon}
        </sami-icon-button>
      </header>
    `;
    }
}

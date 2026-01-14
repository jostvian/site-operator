import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './icon-button.styles';

@customElement('agent-icon-button')
export class AgentIconButton extends LitElement {
    static styles = styles;

    @property() tooltip = '';

    render() {
        return html`
      <button title="${this.tooltip}" aria-label="${this.tooltip || 'Action'}">
        <slot></slot>
      </button>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'agent-icon-button': AgentIconButton;
    }
}

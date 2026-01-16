import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './icon-button.styles';

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

if (!customElements.get('agent-icon-button')) {
  customElements.define('agent-icon-button', AgentIconButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'agent-icon-button': AgentIconButton;
  }
}

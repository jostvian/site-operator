import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './icon-button.styles';

@customElement('sami-icon-button')
export class SamiIconButton extends LitElement {
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
        'sami-icon-button': SamiIconButton;
    }
}

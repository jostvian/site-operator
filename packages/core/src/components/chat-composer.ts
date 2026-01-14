import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styles } from './chat-composer.styles';
import { SendIcon, StopIcon } from '../icons';

@customElement('agent-chat-composer')
export class ChatComposer extends LitElement {
    static styles = styles;

    @property({ type: Boolean }) isRunning = false;
    @property({ type: String }) disclaimer = '';

    @state() private _value = '';
    @query('textarea') private _textarea!: HTMLTextAreaElement;

    private _handleInput(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this._value = target.value;
        this._adjustHeight();
    }

    private _handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this._handleSubmit();
        }
    }

    private _adjustHeight() {
        if (!this._textarea) return;
        this._textarea.style.height = 'auto'; // Reset to shrink if needed
        this._textarea.style.height = `${Math.min(this._textarea.scrollHeight, 160)}px`; // Grow up to max
    }

    async _handleSubmit() {
        if (!this._value.trim()) return;

        this.dispatchEvent(new CustomEvent('send', { detail: { content: this._value }, bubbles: true, composed: true }));
        this._value = '';
        await this.updateComplete;
        this._textarea.style.height = '3rem'; // Reset height
    }

    private _handleStop() {
        this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
    }

    render() {
        return html`
      <div class="composer-container">
        <textarea
            placeholder="Enviar un mensaje a Agent"
            .value="${this._value}"
            @input="${this._handleInput}"
            @keydown="${this._handleKeyDown}"
            ?disabled="${this.isRunning}"
            rows="1"
        ></textarea>
        
        ${this.isRunning
                ? html`<button class="action-button" @click="${this._handleStop}">${StopIcon}</button>`
                : html`<button class="action-button" ?disabled="${!this._value.trim()}" @click="${this._handleSubmit}">${SendIcon}</button>`
            }
      </div>
      <p class="disclaimer">
        ${this.disclaimer}
      </p>
    `;
    }
}

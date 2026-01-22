import { SignalWatcher } from "@lit-labs/signals";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { provide } from "@lit/context";
import { v0_8 } from "@a2ui/lit";
import * as UI from "@a2ui/lit/ui";
import { defaultTheme } from "../models/a2ui.theme";

// Type alias for the processor
type A2UIModelProcessorInstance = v0_8.Types.MessageProcessor;

/**
 * Theme Provider for A2UI Components
 *
 * This component wraps A2UI surfaces and provides the theme context
 * required by the A2UI component library.
 */
@customElement("a2ui-theme-provider")
export class A2UIThemeProvider extends SignalWatcher(LitElement) {
    @provide({ context: UI.Context.themeContext })
    theme: v0_8.Types.Theme = defaultTheme;

    @property({ type: String })
    surfaceId: string = "";

    @property({ type: Object })
    surface: v0_8.Types.Surface | undefined;

    @property({ type: Object })
    processor: A2UIModelProcessorInstance | undefined;

    @property({ type: Boolean })
    enableCustomElements: boolean = true;

    static styles = css`
    :host {
      display: block;
    }
  `;

    render() {
        if (!this.surfaceId || !this.processor) {
            return html``;
        }

        // Attempt to get the surface if not provided
        const surface = this.surface || this.processor.getSurfaces().get(this.surfaceId);

        if (!surface) {
            console.warn(`A2UIThemeProvider: Surface ${this.surfaceId} not found in processor`, this.processor.getSurfaces());
            return html`<!-- Surface ${this.surfaceId} not found -->`;
        }

        return html`
      <a2ui-surface
        .surfaceId=${this.surfaceId}
        .surface=${surface}
        .processor=${this.processor}
        .enableCustomElements=${this.enableCustomElements}
      ></a2ui-surface>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-theme-provider": A2UIThemeProvider;
    }
}

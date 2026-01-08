import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: var(--agent-radius-full, 9999px);
    padding: 0.5rem;
    color: var(--agent-text-zinc-500, #71717a);
    transition: color 0.2s, background-color 0.2s;
  }

  button:hover {
    color: var(--agent-text-foreground, #09090b);
    background-color: var(--agent-bg-zinc-100, #f4f4f5);
  }

  ::slotted(svg) {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

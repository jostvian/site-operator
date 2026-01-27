import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    padding: 1rem;
    /* position: fixed; */
    /* bottom: 0; */
    /* left: 0; */
    /* width: 100%; */
  }

  .composer-container {
    /* max-width: 48rem; / / max-w-screen-md */
    margin: 0 auto;
    display: flex;
    align-items: center;
    background-color: var(--agent-bg-zinc-100, #f4f4f5);
    border-radius: var(--agent-radius-3xl, 1.5rem);
    padding-left: 0.5rem;
    transition: background-color 0.2s;
  }

  .composer-container:focus-within {
    background-color: #e4e4e780; /* zinc-200/50 approx */
  }

  textarea {
    flex-grow: 1;
    background: transparent;
    border: none;
    resize: none;
    max-height: 10rem;
    padding: 0.875rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--agent-text-foreground, #09090b);
    outline: none;
    height: 3rem; /* default roughly h-12 */
  }

  textarea::placeholder {
    color: var(--agent-text-zinc-500, #71717a);
  }

  .action-button {
    margin: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--agent-radius-full, 9999px);
    background-color: transparent;
    border: 1.5px solid transparent;
    color: var(--agent-text-foreground, #09090b);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .action-button:hover:not(:disabled) {
    border-color: #22c55e;
    color: #22c55e;
    background-color: #22c55e10;
  }

  .action-button:hover:not(:disabled) svg {
    fill: #22c55e20; /* Subtle fill for "relleno" feeling */
  }
  
  .action-button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
  }

  /* Make sure icons are sized well inside the circle */
  .action-button svg {
      width: 1.25rem;
      height: 1.25rem;
  }
  
  .disclaimer {
      text-align: center;
      color: var(--agent-text-zinc-500, #71717a);
      font-size: 0.75rem;
      padding: 0.5rem;
  }

  .prompts-list {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;
  }

  .prompt-item {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 0.625rem 0.5rem;
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--agent-text-zinc-600, #52525b);
    transition: all 0.2s ease;
    border-radius: 0.375rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .prompt-item:last-child {
    border-bottom: none;
  }

  .prompt-item:hover {
    background-color: var(--agent-bg-zinc-50, #fafafa);
    color: var(--agent-text-foreground, #09090b);
    padding-left: 0.75rem;
  }
`;

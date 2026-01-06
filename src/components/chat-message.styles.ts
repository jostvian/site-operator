import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    margin: 1rem 0;
  }

  .message-container {
    display: flex;
    gap: 0.75rem;
    max-width: 100%;
  }

  :host([role="user"]) .message-container {
    justify-content: flex-end;
  }

  :host([role="assistant"]) .message-container {
    justify-content: flex-start;
  }

  .avatar {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--sami-radius-full, 9999px);
    border: 1px solid var(--sami-border-zinc-200, #e4e4e7);
    font-size: 0.75rem;
    color: var(--sami-text-foreground, #09090b);
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 80%;
  }

  .bubble {
    padding: 0.5rem 1.25rem;
    border-radius: var(--sami-radius-3xl, 1.5rem);
    color: var(--sami-text-foreground, #09090b);
    line-height: 1.5;
  }

  :host([role="user"]) .bubble {
    background-color: var(--sami-bg-zinc-100, #f4f4f5);
  }

  :host([role="assistant"]) .bubble {
    background-color: transparent;
    padding-left: 0;
  }
  
  .actions {
    display: flex;
    gap: 0.25rem;
    margin-top: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .message-container:hover .actions {
    opacity: 1;
  }
`;

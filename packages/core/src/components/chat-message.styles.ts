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
    align-items: flex-end;
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
    border-radius: var(--agent-radius-full, 9999px);
    border: 1px solid var(--agent-border-zinc-200, #e4e4e7);
    font-size: 0.75rem;
    color: var(--agent-text-foreground, #09090b);
  }

  .avatar-img {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 80%;
  }

  .bubble {
    padding: 0.5rem 1.25rem;
    border-radius: var(--agent-radius-3xl, 1.5rem);
    color: var(--agent-text-foreground, #09090b);
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  :host([role="user"]) .bubble {
    background-color: var(--agent-bg-zinc-100, #f4f4f5);
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

  /* Cursor animation */
  .bubble.streaming::after {
    content: '';
    display: inline-block;
    width: 0.125rem;
    height: 1em;
    background-color: currentColor;
    margin-left: 0.125rem;
    vertical-align: text-bottom;
    animation: cursor-blink 1s step-end infinite;
  }

  @keyframes cursor-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .message-container:hover .actions {
    opacity: 1;
  }

  .typing-indicator {
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem 0;
  }

  .typing-dot {
    width: 0.375rem;
    height: 0.375rem;
    background-color: var(--agent-text-foreground, #09090b);
    border-radius: 50%;
    opacity: 0.4;
    animation: typing 1.4s infinite ease-in-out both;
  }

  .typing-dot:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  .typing-dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes typing {
    0%, 80%, 100% { 
      transform: scale(0);
    } 
    40% { 
      transform: scale(1); 
    }
  }
  .debug-id {
    font-size: 0.65rem;
    color: var(--agent-text-zinc-400, #a1a1aa);
    margin-top: 0.25rem;
    font-family: monospace;
    opacity: 0.6;
    user-select: all;
  }
`;

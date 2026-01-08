import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    height: 100%;
    overflow-y: auto;
    background-color: var(--agent-bg-white, #ffffff);
    padding-top: 4rem; /* Spacer for fixed header */
  }

  .messages-list {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding: 1rem;
    max-width: 48rem; /* max-w-screen-md */
    margin: 0 auto;
    min-height: calc(100% - 4rem); 
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--agent-text-foreground, #09090b);
    min-height: 50vh;
  }

  .empty-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: var(--agent-radius-full, 9999px);
    border: 1px solid var(--agent-border-zinc-200, #e4e4e7);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .empty-avatar-img {
    width: 3rem;
    height: 3rem;
    border-radius: var(--agent-radius-full, 9999px);
    object-fit: cover;
    margin-bottom: 1rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .empty-text {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
`;

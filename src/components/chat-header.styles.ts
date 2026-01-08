import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    border-bottom: 1px solid var(--agent-border-zinc-200, #e4e4e7);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem; /* 64px */
    padding: 0 1rem;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
  }


  h1 {
    margin: 0;
    font-size: 1.125rem; /* 18px */
    font-weight: 600;
    color: var(--agent-text-foreground, #09090b);
  }

  .actions {
      display: flex;
      gap: 0.5rem;
  }
`;

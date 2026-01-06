import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    padding: 1rem;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    /* background: linear-gradient(to top, white, transparent); */
  }

  .composer-container {
    max-width: 48rem; /* max-w-screen-md */
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    background-color: var(--sami-bg-zinc-100, #f4f4f5);
    border-radius: var(--sami-radius-3xl, 1.5rem);
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
    color: var(--sami-text-foreground, #09090b);
    outline: none;
    height: 3rem; /* default roughly h-12 */
  }

  textarea::placeholder {
    color: var(--sami-text-zinc-500, #71717a);
  }

  .action-button {
    margin: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--sami-radius-full, 9999px);
    background-color: var(--sami-bg-black, #09090b);
    color: var(--sami-text-white, #ffffff);
    transition: opacity 0.2s;
    cursor: pointer;
  }
  
  .action-button:disabled {
      opacity: 0.1;
      cursor: not-allowed;
  }

  /* Make sure icons are sized well inside the circle */
  .action-button svg {
      width: 1.25rem;
      height: 1.25rem;
  }
  
  .disclaimer {
      text-align: center;
      color: var(--sami-text-zinc-500, #71717a);
      font-size: 0.75rem;
      padding: 0.5rem;
  }
`;

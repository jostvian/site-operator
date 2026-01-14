import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--agent-bg-white, #ffffff);
    overflow: hidden;
    position: relative;
  }

  .chat-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
  }

  agent-chat-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
  }

  agent-chat-thread {
      flex: 1;
      /* padding-bottom: 8rem; / / Space for composer */
  }

  .inspector-toggle {
    position: absolute;
    bottom: 110px;
    left: 20px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
    z-index: 999;
  }

  .inspector-toggle:hover {
    background: #f3f4f6;
    color: #111827;
    transform: scale(1.1);
  }

`;

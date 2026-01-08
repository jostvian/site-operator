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
      padding-bottom: 8rem; /* Space for composer */
  }

`;

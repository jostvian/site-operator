import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    position: absolute;
    top: 4rem;
    left: 0;
    bottom: 0;
    width: 260px;
    background: #ffffff;
    border-right: 1px solid #e5e5e5;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 20;
    box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  }

  :host([open]) {
    transform: translateX(0);
  }

  .header {
    height: 60px;
    padding: 0 1rem;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;
    font-size: 0.95rem;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    background: #fafafa;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    height: calc(100% - 60px);
  }

  .item {
    padding: 1rem;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9rem;
    color: #4a4a4a;
  }

  .item:hover {
    background-color: #f9f9f9;
    color: #1a1a1a;
  }

  .empty-state {
    padding: 2rem 1rem;
    text-align: center;
    color: #999;
    font-size: 0.9rem;
  }
`;

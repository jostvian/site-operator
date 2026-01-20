import { css } from 'lit';

export const styles = css`
  :host {
    position: absolute;
    bottom: 60px;
    left: 20px;
    width: 400px;
    height: 500px;
    min-width: 300px;
    min-height: 200px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 1000;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .header {
    padding: 12px 16px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    user-select: none;
    flex-shrink: 0;
  }

  .header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }

  .close-button {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    background: #f3f4f6;
    color: #111827;
  }

  .tabs {
    display: flex;
    background: #f3f4f6;
    padding: 4px;
    gap: 4px;
    flex-shrink: 0;
  }

  .tab {
    flex: 1;
    padding: 6px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    color: #6b7280;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .tab:hover {
    color: #374151;
  }

  .tab.active {
    background: #ffffff;
    color: #111827;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    font-size: 12px;
  }

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    background: #f9fafb;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    color: #374151;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .event-item {
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .event-item:last-child {
    border-bottom: none;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .event-name {
    font-weight: 600;
    color: #6366f1;
  }

  .event-time {
    color: #9ca3af;
    font-size: 10px;
  }

  .event-content {
    margin-top: 4px;
  }

  details {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
  }

  summary {
    padding: 6px 10px;
    cursor: pointer;
    background: #f3f4f6;
    font-family: ui-monospace, monospace;
    font-size: 11px;
    color: #4b5563;
    user-select: none;
  }

  summary:hover {
    background: #e5e7eb;
  }

  details[open] summary {
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 0;
  }

  details pre {
    border: none;
    border-radius: 0;
    padding: 10px;
  }

  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    cursor: nwse-resize;
    z-index: 1001;
    background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
    background-size: 4px 4px;
    background-position: center;
  }

  .context-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .edit-button, .save-button, .cancel-button {
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .edit-button {
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    color: #374151;
  }

  .edit-button:hover {
    background: #e5e7eb;
  }

  .save-button {
    background: #6366f1;
    border: 1px solid #4f46e5;
    color: white;
  }

  .save-button:hover {
    background: #4f46e5;
  }

  .cancel-button {
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #6b7280;
  }

  .cancel-button:hover {
    background: #f9fafb;
  }

  .editor-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
  }

  .context-editor {
    flex: 1;
    width: 100%;
    min-height: 200px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    color: #374151;
    resize: none;
  }

  .editor-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

`;

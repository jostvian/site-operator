import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { inspectorService } from '../services/inspector.service';
import { styles } from './inspector-window.styles';

@customElement('agent-inspector-window')
export class InspectorWindow extends LitElement {
  static styles = styles;

  @state() private _activeTab: 'context' | 'state' | 'messages' | 'stream' = 'stream';
  @state() private _context: any = null;
  @state() private _appState: any = null;
  @state() private _messages: any[] = [];
  @state() private _stream: any[] = [];
  @state() private _isEditing = false;
  @state() private _editedData = "";

  private _isDragging = false;
  private _isResizing = false;
  private _currentX: number = 0;
  private _currentY: number = 0;
  private _initialX: number = 0;
  private _initialY: number = 0;
  private _xOffset: number = 0;
  private _yOffset: number = 0;

  private _initialWidth: number = 0;
  private _initialHeight: number = 0;

  connectedCallback() {
    super.connectedCallback();
    inspectorService.addEventListener('inspector-change', this._onInspectorChange);
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);
    this._updateData();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    inspectorService.removeEventListener('inspector-change', this._onInspectorChange);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
  }

  private _onMouseMove = (e: MouseEvent) => {
    if (this._isDragging) {
      this._drag(e);
    } else if (this._isResizing) {
      this._resize(e);
    }
  };

  private _onMouseUp = () => {
    if (this._isDragging) {
      this._dragEnd();
    } else if (this._isResizing) {
      this._resizeEnd();
    }
  };

  private _onInspectorChange = () => {
    this._updateData();
  };

  private _updateData() {
    this._context = inspectorService.context;
    this._appState = inspectorService.state;
    this._messages = inspectorService.messages;
    this._stream = inspectorService.stream;
    this.requestUpdate();
  }

  private _handleClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  private _dragStart(e: MouseEvent | TouchEvent) {
    if (e.target && (e.target as HTMLElement).closest('.close-button')) return;

    if (e.type === "touchstart") {
      this._initialX = (e as TouchEvent).touches[0].clientX - this._xOffset;
      this._initialY = (e as TouchEvent).touches[0].clientY - this._yOffset;
    } else {
      this._initialX = (e as MouseEvent).clientX - this._xOffset;
      this._initialY = (e as MouseEvent).clientY - this._yOffset;
    }

    this._isDragging = true;
  }

  private _drag(e: MouseEvent | TouchEvent) {
    if (this._isDragging) {
      if (e.type !== "mousemove") e.preventDefault();

      if (e.type === "touchmove") {
        this._currentX = (e as TouchEvent).touches[0].clientX - this._initialX;
        this._currentY = (e as TouchEvent).touches[0].clientY - this._initialY;
      } else {
        this._currentX = (e as MouseEvent).clientX - this._initialX;
        this._currentY = (e as MouseEvent).clientY - this._initialY;
      }

      this._xOffset = this._currentX;
      this._yOffset = this._currentY;

      this._setTranslate(this._currentX, this._currentY);
    }
  }

  private _dragEnd() {
    this._initialX = this._currentX;
    this._initialY = this._currentY;
    this._isDragging = false;
  }

  private _resizeStart(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this._isResizing = true;
    this._initialX = e.clientX;
    this._initialY = e.clientY;
    this._initialWidth = this.getBoundingClientRect().width;
    this._initialHeight = this.getBoundingClientRect().height;
  }

  private _resize(e: MouseEvent) {
    if (this._isResizing) {
      const deltaX = e.clientX - this._initialX;
      const deltaY = e.clientY - this._initialY;
      this.style.width = `${this._initialWidth + deltaX}px`;
      this.style.height = `${this._initialHeight + deltaY}px`;
    }
  }

  private _resizeEnd() {
    this._isResizing = false;
  }

  private _setTranslate(xPos: number, yPos: number) {
    this.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }

  render() {
    return html`
      <div class="header"
        @mousedown="${this._dragStart}"
        @touchstart="${this._dragStart}"
        @touchmove="${this._drag}"
        @touchend="${this._dragEnd}"
      >
        <h3>Inspector</h3>
        <button class="close-button" @click="${this._handleClose}">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31317L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <div class="tabs">
        <div class="tab ${this._activeTab === 'context' ? 'active' : ''}" @click="${() => this._activeTab = 'context'}">Context</div>
        <div class="tab ${this._activeTab === 'state' ? 'active' : ''}" @click="${() => this._activeTab = 'state'}">State</div>
        <div class="tab ${this._activeTab === 'messages' ? 'active' : ''}" @click="${() => this._activeTab = 'messages'}">Messages</div>
        <div class="tab ${this._activeTab === 'stream' ? 'active' : ''}" @click="${() => this._activeTab = 'stream'}">Stream</div>
      </div>
      <div class="content">
        ${this._renderContent()}
      </div>
      <div class="resize-handle" @mousedown="${this._resizeStart}"></div>
    `;
  }

  private _renderContent() {
    switch (this._activeTab) {
      case 'context':
        return this._renderEditableSection('context', this._context);
      case 'state':
        return this._renderEditableSection('state', this._appState);
      case 'messages':
        return html`<pre>${JSON.stringify(this._messages, null, 2)}</pre>`;
      case 'stream':
        return html`
          <div class="stream-list">
            ${this._stream.map(item => html`
              <div class="event-item">
                <div class="event-header">
                  <span class="event-name">${item.event}</span>
                  <span class="event-time">${item.time}</span>
                </div>
                <div class="event-content">
                  <details>
                    <summary>JSON</summary>
                    <pre>${JSON.stringify(item.content, null, 2)}</pre>
                  </details>
                </div>
              </div>
            `)}
            ${this._stream.length === 0 ? html`<div style="color: #9ca3af; text-align: center; padding: 20px;">No events yet</div>` : ''}
          </div>
        `;
    }
  }

  private _renderEditableSection(type: 'context' | 'state', data: any) {
    if (this._isEditing) {
      return html`
        <div class="editor-container">
          <textarea 
            class="context-editor" 
            .value="${this._editedData}"
            @input="${(e: any) => this._editedData = e.target.value}"
          ></textarea>
          <div class="editor-actions">
            <button class="cancel-button" @click="${this._handleCancelEdit}">Cancel</button>
            <button class="save-button" @click="${() => this._handleSave(type)}">Save Changes</button>
          </div>
        </div>
      `;
    }
    return html`
      <div class="context-header">
        <span>Current ${type === 'context' ? 'Static Context' : 'Dynamic State'}</span>
        <button class="edit-button" @click="${() => this._handleEdit(data)}">Edit</button>
      </div>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
  }

  private _handleEdit(data: any) {
    this._editedData = JSON.stringify(data, null, 2);
    this._isEditing = true;
  }

  private _handleCancelEdit() {
    this._isEditing = false;
  }

  private _handleSave(type: 'context' | 'state') {
    try {
      const parsed = JSON.parse(this._editedData);
      const eventName = type === 'context' ? 'context-update' : 'state-update';
      this.dispatchEvent(new CustomEvent(eventName, {
        detail: parsed,
        bubbles: true,
        composed: true
      }));
      this._isEditing = false;
    } catch (e) {
      alert('Invalid JSON: ' + (e as Error).message);
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'agent-inspector-window': InspectorWindow;
  }
}

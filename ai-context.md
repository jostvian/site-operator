# AI Context - Lit Agent Chat

## Project Overview
**Name**: `lit-agent-chat`
**Type**: NPM Library / Web Component Widget
**Frameworks**: Lit (Web Components), TypeScript, Vite, Wireit.
**Purpose**: A customizable, framework-agnostic AI chat widget that acts as a "copilot" for host applications. It connects to a backend agent (via `@ag-ui/client`) and allows the agent to control the host app through the **Chat Portal API**.

## Architecture

The project follows a **Clean Architecture** inspired structure:

### 1. Components (`src/components`)
Pure UI components built with Lit. They react to state changes provided by controllers.
- `AgentChat` (`agent-chat.ts`): The main container and entry point. Manages the high-level layout (Header, Thread, Composer, History, Inspector).
- `ChatThread` (`chat-thread.ts`): Renders the list of messages (`Message` type).
- `ChatComposer` (`chat-composer.ts`): Input field for user messages.
- `ChatHistoryList` (`chat-history-list.ts`): Sidebar displaying past conversations.
- `AgentInspectorWindow` (`inspector-window.ts`): A draggable debug window showing internal agent state and events.

### 2. State Management (`src/hooks`)
- `ChatController` (`chat.controller.ts`): Acts as the **ViewModel**. It binds the UI components to the underlying services. It exposes reactive state (`thread`, `conversations`) and handles user actions (`sendMessage`, `loadConversation`).

### 3. Services (`src/services`)
Business logic layer. Services are singletons or instantiated by the Controller.
- `ChatService` (`chat.service.ts`):
    - Manages the WebSocket/HTTP connection to the backend using `@ag-ui/client`.
    - Handle message sending and receiving.
    - Manages the `ChatThread` state.
    - Listens for `client_tool_call` events to trigger Portal actions.
- `ConversationService` (`conversation.service.ts`): Handles CRUD operations for conversations (fetch list, create new, delete).
- `ChatPortalService` (`chat-portal.service.ts`) **[New]**:
    - Manages the "Copilot" functionality.
    - Stores the `PortalSpec` (NavGraph, Actions) registered by the host app.
    - Executes navigation plans requested by the agent.
- `InspectorService` (`inspector.service.ts`): Captures events for the debug inspector.

### 4. Models (`src/models`)
- `portal.types.ts`: Definitions for `PortalSpec`, `NavGraph`, `NavPlan`, `NavNode`.
- `chat.types.ts`: Definitions for `Message`, `ChatThread`, `AgentState`.
- `conversation.types.ts`: Definitions for `Conversation`, `ConversationSummary`.

## Key Features

### Library Mode & Public API
The project is built as a library (`npm run build` produces `dist/`).
- **Entry Point**: `src/index.ts`.
- **Exports**: `AgentChat` component, `chatPortalService`, `mount()` helper.
- **Mounting**:
  ```javascript
  import { mount } from 'lit-agent-chat';
  mount(document.body, { backendUrl: '...', appName: '...' });
  ```

### Chat Portal API (Copilot)
Enables the agent to navigate the host app.
1. **Registration**: Host app calls `chatPortalService.registerPortal(spec)`.
2. **Execution**: Agent sends a `executePlan` tool call.
3. **Handling**: `ChatSubscriber` detects the tool call, `ChatPortalService` executes the matching action defined in `spec.actions`.

### Conversation History
- **Manual Refresh**: The history list is refreshed only when the sidebar is opened or explicitly requested, avoiding unnecessary network traffic.

## Development Guidelines
1. **Architecture**: Respect the separation of concerns. UI -> Controller -> Service.
2. **Styling**: Use `styles/` folder or component-scoped styles. Avoid external CSS libs for simple things.
3. **Build**: Always check `npm run build` after changes.
4. **Commits**: Use `jostvian-agent` author.

## Directory Structure
```
src/
├── components/       # Lit Web Components
├── hooks/            # Controllers (ViewModel)
├── models/           # TypeScript Interfaces
├── services/         # Business Logic & API calls
├── styles/           # Shared styles
├── utils/            # Helper functions
└── index.ts          # Library Entry Point
```

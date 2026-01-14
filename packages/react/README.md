# Site Operator React

The React 19 wrapper for Site Operator. It provides a seamless integration of the Site Operator agent widget into React applications.

## Installation

```bash
npm install site-operator-react
```

*Note: You must also have `react` and `react-dom` installed.*

## Usage

### AgentChat Component

The `<AgentChat />` component renders the chat widget. It wraps the underlying Web Component and handles prop syncing.

```tsx
import { AgentChat } from 'site-operator-react';

function App() {
  return (
    <div className="App">
      <AgentChat
        backendUrl="http://localhost:8001/ag_ui"
        conversationUrl="http://localhost:8003"
        appName="My React App"
        agentAvatar="/avatar.png"
        disclaimer="Agent puede cometer errores. Verifica la información importante"
        emptyText="¿Cómo puedo ayudarte hoy?"
        placeholder="Enviar un mensaje a Agent"
      />
    </div>
  );
}
```

### useChatPortal Hook

The `useChatPortal` hook allows you to register the "Copilot" capabilities (Portal Spec) for your application. This lets the agent control the app (e.g., navigate, perform actions).

```tsx
import { useChatPortal } from 'site-operator-react';

function App() {
  useChatPortal({
    actions: {
      openSettings: () => {
        // Your logic to open settings
      },
      navigate: ({ path }) => {
        // Your router logic
      }
    }
  });

  return (
    // ...
  );
}
```

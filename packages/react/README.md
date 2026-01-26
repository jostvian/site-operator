# Site Operator React

The React 19 wrapper for Site Operator. It provides a seamless integration of the Site Operator agent widget into React applications.

## Installation

npm install site-operator-react

```tsx
import { AgentChat, type AppContext, type AppState } from 'site-operator-react';
import type { AgentChat as AgentChatElement } from 'site-operator';
import { useRef } from 'react';

const context: AppContext = {
  v: "1.1",
  site: { 
    name: "My Portal", 
    description: "Main customer management portal",
    deployment: "prod",
    baseUrl: "https://myportal.com", 
    locale: "en-US" 
  },
  user: { id: "u-123", displayName: "Jost" },
  nav: {
    globalClickTargets: [
      {
        id: "lnk.nav.clients",
        name: "ClientsLink",
        kind: "link",
        label: "Clients",
        locator: { testId: "nav-clients" },
        action: { "type": "navigate", "toRouteId": "clients.list", "toPath": "/clients" }
      }
    ],
    routes: [
      {
        id: "clients.list",
        path: "/clients",
        title: "Client Directory",
        description: "List of all active customers in the system",
        clickTargets: [
          {
            id: "btn.createClient",
            name: "CreateClient",
            kind: "button",
            label: "Add Client",
            description: "Opens the registration form for new customers",
            locator: { testId: "clients-create" },
            action: { "type": "navigate", "toRouteId": "clients.create", "toPath": "/clients/new" }
          }
        ]
      }
    ]
  }
};

const state: AppState = {
  v: "1.1",
  location: {
    routeId: "clients.list",
    path: "/clients?status=active",
    params: { "status": "active" },
    title: "Clientes"
  },
  ui: {
    visibleClickTargetIds: ["lnk.nav.clients", "btn.createClient"]
  },
  focus: { "type": "client", "id": "c-77", "label": "ACME S.A." }
};

function App() {
  const chatRef = useRef<AgentChatElement>(null);

  return (
    <div className="App">
      <AgentChat
        ref={chatRef}
        backendUrl="http://localhost:8001/ag_ui"
        appName="My React App"
        context={{ appContext: context, appState: state }}
      />
    </div>
  );
}
```


### useChatPortal Hook

The `useChatPortal` hook allows you to register the "Copilot" capabilities (`AppContext`) for your application. This lets the agent understand the app structure and available targets. It can also return the live `ChatController` from `AgentChat` when you pass a `chatRef`.

```tsx
import { useChatPortal, type AppContext } from 'site-operator-react';
import type { AgentChat as AgentChatElement } from 'site-operator';
import { useRef } from 'react';

const context: AppContext = {
  v: "1.1",
  // ... configuration ...
  site: { name: "Mi Portal" },
  user: { id: "u-123" },
  nav: {
    routes: []
  }
};

function App() {
  const chatRef = useRef<AgentChatElement>(null);
  const controller = useChatPortal(context, { chatRef });

  return (
    <AgentChat ref={chatRef} context={{ appContext: context }} />
  );
}

// How chatRef works:
// - pass it to <AgentChat /> so React forwards it to the web component
// - useChatPortal listens for the "controller-ready" event
// - once ready, it returns the live ChatController instance
// controller?.sendMessage('Hola');
```

### AgentChatProvider + AgentChatMount + useAgentChatController

If you prefer a React Context approach, wrap your app (or a subtree) with `AgentChatProvider`. It manages the `ref` and exposes the `ChatController` via `useAgentChatController`. Place `<AgentChatMount />` where you want the chat UI to render.

```tsx
import { AgentChatProvider, AgentChatMount, useAgentChatController, type AppContext } from 'site-operator-react';

const context: AppContext = {
  v: "1.1",
  site: { name: "Mi Portal" },
  user: { id: "u-123" },
  nav: { routes: [] }
};

function ChatActions() {
  const controller = useAgentChatController();
  return (
    <button onClick={() => controller?.startNewThread()}>
      Nuevo chat
    </button>
  );
}

function App() {
  return (
    <AgentChatProvider
      backendUrl="http://localhost:8001/ag_ui"
      appName="My React App"
      context={{ appContext: context }}
    >
      <header>Mi App</header>
      <main>
        <AgentChatMount className="chat-root" />
      </main>
      <ChatActions />
    </AgentChatProvider>
  );
}
```

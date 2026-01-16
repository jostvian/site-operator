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
import { AgentChat, type AppContext, type AppState } from 'site-operator-react';

const context: AppContext = {
  v: "1.1",
  site: { name: "Mi Portal", baseUrl: "https://miportal.com", locale: "es-CO" },
  user: { id: "u-123", displayName: "Jost" },
  nav: {
    globalClickTargets: [
      {
        id: "lnk.nav.clients",
        kind: "link",
        label: "Clientes",
        testId: "nav-clients",
        action: { "type": "navigate", "toRouteId": "clients.list", "toPath": "/clients" }
      }
    ],
    routes: [
      {
        id: "clients.list",
        path: "/clients",
        title: "Clientes",
        clickTargets: [
          {
            id: "btn.createClient",
            kind: "button",
            label: "Crear cliente",
            testId: "clients-create",
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
  return (
    <div className="App">
      <AgentChat
        backendUrl="http://localhost:8001/ag_ui"
        appName="My React App"
        context={{ appContext: context, appState: state }}
      />
    </div>
  );
}
```


### useChatPortal Hook

The `useChatPortal` hook allows you to register the "Copilot" capabilities (`AppContext`) for your application. This lets the agent understand the app structure and available targets.

```tsx
import { useChatPortal, type AppContext } from 'site-operator-react';

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
  useChatPortal(context);

  return (
    // ...
  );
}
```


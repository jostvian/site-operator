# Site Operator React

The React 19 wrapper for Site Operator. It provides a seamless integration of the Site Operator agent widget into React applications.

## Installation

npm install site-operator-react

```tsx
import { AgentChat, type AppContext, type AppState } from 'site-operator-react';

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


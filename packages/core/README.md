# Site Operator (Core)

The core Web Component library for Site Operator. It provides the `<agent-chat>` custom element and the `chatPortalService`.

This package is framework-agnostic.

## Installation

```bash
npm install site-operator
```

## Usage

### React

Site Operator provides a React wrapper for easy integration.

```tsx
import { AgentChat, useChatPortal, type AppContext, type AppState } from 'site-operator-react';

const MyApp = () => {
  // 1. Static Context (Site, User, Routes)
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
          keywords: ["clientes", "personas"],
          clickTargets: [
            {
              id: "btn.createClient",
              kind: "button",
              label: "Crear cliente",
              keywords: ["nuevo cliente", "crear"],
              testId: "clients-create",
              action: { "type": "navigate", "toRouteId": "clients.create", "toPath": "/clients/new" }
            }
          ]
        }
      ]
    }
  };

  // 2. Dynamic State (Location, UI, Focus)
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

  useChatPortal(context);

  return (
    <AgentChat 
      backendUrl="http://localhost:8001/ag_ui"
      appName="My App"
      context={{ appContext: context, appState: state }}
    />
  );
};
```


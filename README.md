# Site Operator

A customizable, framework-agnostic AI chat widget that acts as a "copilot" for host applications. It connects to a backend agent and allows the agent to observe and control the host app through its rich **Chat Portal Protocol**.

## Key Features

- **Framework Agnostic**: Core library built with Lit Web Components.
- **React Ready**: Official wrapper for React 19.
- **Deep Context**: Share your app's routes, UI components, and business context with the agent.
- **Action Execution**: Enable the agent to navigate, open modals, or trigger custom app logic.
- **Developer Tools**: Built-in inspector to debug agent-host communication.

## Monorepo Structure

- **[`packages/core`](./packages/core)**: The core library (`site-operator`). Use this for Vanilla JS, Vue, Angular, or any other framework.
- **[`packages/react`](./packages/react)**: React-specific wrapper (`site-operator-react`) with hooks and components.

## Installation

```bash
npm install site-operator
# or
npm install site-operator-react
```

## Quick Start (React)

```tsx
import { AgentChat, useChatPortal } from 'site-operator-react';

const myConfig = {
  v: "1.1",
  site: { name: "My Portal" },
  nav: {
    routes: [
      { 
        path: "/leads", 
        name: "Leads", 
        title: "Sales Leads",
        clickTargets: [
           { name: "New Lead", action: { type: "open", targetId: "create" } }
        ]
      }
    ]
  }
};

function App() {
  // Register the app context so the agent knows the available actions
  useChatPortal(myConfig);

  return (
    <AgentChat
      backendUrl="https://your-api.com/ag_ui"
      appName="My App"
      inspector={true}
    />
  );
}
```

## Documentation

For detailed information on how to define your application structure, visit the package-specific READMEs:

- [Core Library Documentation (AppContext, AppState)](./packages/core/README.md)
- [React Wrapper & Hooks](./packages/react/README.md)

## Development

```bash
npm install
npm run build
npm run dev -w site-operator
```


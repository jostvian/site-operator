# Site Operator

A customizable, framework-agnostic AI chat widget that acts as a "copilot" for host applications. It connects to a backend agent and allows the agent to control the host app through a **Chat Portal API**.

## Monorepo Structure

This repository is a monorepo containing the following packages:

*   **`packages/core`** (`site-operator`): The core library built with Lit Web Components. It is framework-agnostic and can be used in any web application.
*   **`packages/react`** (`site-operator-react`): A wrapper library for React 19 applications, providing a convenient `<AgentChat />` component and hooks.

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (v9 or later, supporting workspaces)

### Installation

To install dependencies for all packages:

```bash
npm install
```

### Building

To build all packages:

```bash
npm run build
```

To build a specific package:

```bash
npm run build -w site-operator
# or
npm run build -w site-operator-react
```

### Development

To start the development server for the core package:

```bash
npm run dev -w site-operator
```

## Usage

### Core (Vanilla JS / Web Components)

```javascript
import { mount } from 'site-operator';

mount(document.body, {
  backendUrl: 'http://localhost:8001/ag_ui',
  appName: 'My App'
});
```

### React

```tsx
import { AgentChat, useChatPortal } from 'site-operator-react';

function App() {
  useChatPortal({
    // ... portal spec
  });

  return (
    <AgentChat
      backendUrl="http://localhost:8001/ag_ui"
      appName="My React App"
    />
  );
}
```

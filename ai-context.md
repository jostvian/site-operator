# AI Context - Site Operator

## Project Overview
**Name**: `site-operator` (Monorepo)
**Type**: Monorepo of NPM Libraries / Web Component Widget
**Frameworks**: Lit (Web Components), React, TypeScript, Vite, Wireit, npm workspaces.
**Purpose**: A customizable, framework-agnostic AI chat widget that acts as a "copilot" for host applications. It connects to a backend agent (via `@ag-ui/client`) and allows the agent to control the host app through the **Chat Portal API**.

## Architecture

The project is structured as a **Monorepo** using npm workspaces.

### Packages

#### 1. Core (`packages/core`)
The framework-agnostic Web Component library.
- **Name**: `site-operator`
- **Tech**: Lit, TypeScript, Vite.
- **Components**: `AgentChat` (Web Component).
- **Services**: `ChatPortalService`, `ChatService`, etc.
- **Architecture**: Clean Architecture (Components -> Controllers -> Services).

#### 2. React (`packages/react`)
The React wrapper for the core library.
- **Name**: `site-operator-react`
- **Tech**: React 19, TypeScript, Vite.
- **Exports**:
    - `AgentChat`: React component wrapping the custom element.
    - `useChatPortal`: Hook for registering portal specs.
- **Dependencies**: Depends on `site-operator` (core) and `react` (peer).

## Key Features

### Library Mode & Public API (Core)
- **Entry Point**: `packages/core/src/index.ts`.
- **Exports**: `AgentChat` component, `chatPortalService`, `mount()` helper.

### React Integration
- **Component**: `<AgentChat backendUrl="..." />`
- **Hook**: `useChatPortal(spec)`

### Chat Portal API (Copilot)
Enables the agent to navigate the host app.
1. **Registration**: Host app calls `chatPortalService.registerPortal(spec)`.
2. **Execution**: Agent sends a `executePlan` tool call.
3. **Handling**: `ChatSubscriber` detects the tool call, `ChatPortalService` executes the matching action defined in `spec.actions`.

## Development Guidelines
1. **Monorepo**: Run commands from the root using `npm run <command> --workspaces` or `npm run <command> -w <package-name>`.
2. **Architecture**: Respect the separation of concerns. UI -> Controller -> Service.
3. **Styling**: Use `styles/` folder or component-scoped styles. Avoid external CSS libs for simple things.
4. **Build**: Always check `npm run build` after changes.
5. **Commits**: Use `jostvian-agent` author.

## Directory Structure
```
/
├── packages/
│   ├── core/                 # Original Web Component library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── react/                # React wrapper library
│       ├── src/
│       │   ├── AgentChat.tsx
│       │   ├── useChatPortal.ts
│       │   └── index.ts
│       ├── package.json
│       └── vite.config.ts
├── package.json              # Root workspaces config
├── ai-context.md
└── README.md
```

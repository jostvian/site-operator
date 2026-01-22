# Site Operator (Core)

The core Web Component library for Site Operator. It provides the `<agent-chat>` custom element and the `chatPortalService`.

This package is framework-agnostic and built with Lit.

## Installation

```bash
npm install site-operator
```

## Development

```bash
npm run dev
npm run build
npm run preview
```

## Chat Portal API

The Chat Portal API is the bridge that allows the AI Agent to understand and interact with your application. It consists of two main parts:

1.  **AppContext**: Static definition of your site (routes, users, global actions).
2.  **AppState**: Dynamic definition of the current state (current URL, visible buttons, active focus).

### Example: Defining your Application Context

```typescript
import { chatPortalService, type AppContext } from 'site-operator';

const myAppContext: AppContext = {
  v: "1.1",
  site: { 
    name: "Dali CRM", 
    description: "Main sales and lead management portal",
    deployment: "prod",
    locale: "en-US" 
  },
  nav: {
    routes: [
      {
        id: "leads.list",
        name: "Leads List",
        path: "/leads",
        title: "Sales Leads",
        description: "Standard view for managing and filtering sales leads",
        keywords: ["leads", "prospects", "sales"],
        clickTargets: [
          {
            id: "btn.newLead",
            name: "Create New Lead",
            label: "New Lead",
            description: "Opens the lead creation form",
            kind: "button",
            locator: { testId: "create-lead-btn" },
            action: { type: "open", targetId: "LeadCreateModal" }
          }
        ]
      }
    ],
    globalClickTargets: [
      {
        id: "nav.dashboard",
        name: "Dashboard",
        label: "Home",
        kind: "link",
        action: { type: "navigate", toPath: "/dashboard" }
      }
    ]
  }
};

// Register the portal so the agent knows about it
chatPortalService.registerPortal(myAppContext);
```

### Example: Updating Dynamic State

```typescript
import { chatService, type AppState } from 'site-operator';

const currentState: AppState = {
  v: "1.1",
  location: {
    path: "/leads?status=new",
    title: "New Leads",
    params: { status: "new" }
  },
  ui: {
    // Tell the agent exactly which buttons are visible on the screen right now
    visibleClickTargetIds: ["btn.newLead", "nav.dashboard"]
  },
  focus: {
    type: "lead",
    id: "lead_123",
    label: "John Doe"
  }
};

chatService.setAppState(currentState);
```

## Using the Web Component

```html
<script type="module" src="node_modules/site-operator/dist/site-operator.es.js"></script>

<agent-chat
  backend-url="https://your-api.com/ag_ui"
  app-name="Dali CRM"
  inspector="true"
></agent-chat>

<script>
  const chat = document.querySelector('agent-chat');
  // You can also set context/state directly on the element
  chat.setAppContext(myAppContext);
</script>
```


# Site Operator (Core)

The core Web Component library for Site Operator. It provides the `<agent-chat>` custom element and the `chatPortalService`.

This package is framework-agnostic.

## Installation

```bash
npm install site-operator
```

## Usage

### Vanilla JS

```javascript
import { mount } from 'site-operator';

// Mount the chat widget
mount(document.body, {
  backendUrl: 'http://localhost:8001/ag_ui',
  appName: 'My App'
});

// Register portal actions (Copilot)
import { chatPortalService } from 'site-operator';

chatPortalService.registerPortal({
  actions: {
    navigate: (args) => console.log('Navigating to', args.url)
  }
});
```

### HTML

You can also use it directly if loaded via script tag (assuming UMD build):

```html
<script src="path/to/site-operator.umd.js"></script>
<agent-chat backend-url="..." app-name="..."></agent-chat>
```

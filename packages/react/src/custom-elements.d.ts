import 'react';
import { AgentChat as AgentChatElement } from 'site-operator';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'agent-chat': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'backend-url'?: string;
        'app-name'?: string;
        'agent-avatar'?: string;
        'inspector'?: string;
        class?: string;
        ref?: React.RefObject<AgentChatElement | null>;
      };
    }
  }
}

import 'react';
import { AgentChat as AgentChatElement } from 'site-operator';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'agent-chat': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'backend-url'?: string;
        'conversation-url'?: string;
        'app-name'?: string;
        'agent-avatar'?: string;
        'disclaimer'?: string;
        'empty-text'?: string;
        'placeholder'?: string;
        'header-title'?: string;
        'hide-header'?: boolean;
        'inspector'?: string;
        'interceptor'?: boolean;
        class?: string;
        ref?: React.RefObject<AgentChatElement | null>;
      };
    }
  }
}

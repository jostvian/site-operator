import 'react';
import { AgentChat as AgentChatElement } from 'site-operator';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'agent-chat': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        backendUrl?: string;
        conversationUrl?: string;
        appName?: string;
        agentAvatar?: string;
        disclaimer?: string;
        emptyText?: string;
        placeholder?: string;
        headerTitle?: string;
        hideHeader?: boolean;
        inspector?: string;
        interceptor?: boolean;
        class?: string;
        ref?: React.RefObject<AgentChatElement | null>;
      };
    }
  }
}

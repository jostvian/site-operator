import React, { useEffect, useRef } from 'react';
import { AgentChat as AgentChatElement, type AgentState } from 'site-operator';
import 'site-operator';

export interface ComposerProps {
  disclaimer?: string;
  placeholder?: string;
}

export interface ThreadViewProps {
  emptyText?: string;
}

export interface HeaderProps {
  title?: string;
  hide?: boolean;
}

export interface ContextProps {
  appContext?: AgentState;
}

export interface AgentChatProps {
  backendUrl?: string;
  conversationUrl?: string;
  appName?: string;
  agentAvatar?: string;
  inspector?: boolean;
  interceptor?: boolean;
  className?: string;
  composer?: ComposerProps;
  thread?: ThreadViewProps;
  header?: HeaderProps;
  context?: ContextProps;
}

export const AgentChat: React.FC<AgentChatProps> = ({
  backendUrl,
  conversationUrl,
  appName,
  agentAvatar,
  inspector,
  interceptor,
  className,
  composer,
  thread,
  header,
  context
}) => {
  const ref = useRef<AgentChatElement>(null);

  useEffect(() => {
    if (ref.current && context?.appContext) {
      ref.current.setAppContext(context.appContext);
    }
  }, [context?.appContext]);

  return (
    <agent-chat
      ref={ref}
      backend-url={backendUrl}
      conversation-url={conversationUrl}
      app-name={appName}
      agent-avatar={agentAvatar}
      disclaimer={composer?.disclaimer}
      placeholder={composer?.placeholder}
      empty-text={thread?.emptyText}
      header-title={header?.title}
      hide-header={header?.hide}
      inspector={inspector ? "true" : undefined}
      interceptor={interceptor ? true : undefined}
      class={className}
    />
  );
};

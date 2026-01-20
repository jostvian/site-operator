import React, { useEffect, useRef } from 'react';
import { AgentChat as AgentChatElement, type AppState, type AppContext } from 'site-operator';
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
  appContext?: AppContext;
  appState?: AppState;
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

  useEffect(() => {
    if (ref.current && context?.appState) {
      ref.current.setAppState(context.appState);
    }
  }, [context?.appState]);


  return (
    <agent-chat
      ref={ref}
      backendUrl={backendUrl}
      conversationUrl={conversationUrl}
      appName={appName}
      agentAvatar={agentAvatar}
      disclaimer={composer?.disclaimer}
      placeholder={composer?.placeholder}
      emptyText={thread?.emptyText}
      headerTitle={header?.title}
      hideHeader={header?.hide}
      inspector={inspector ? "true" : undefined}
      interceptor={interceptor ? true : undefined}
      class={className}
    />
  );
};

import React, { useEffect, useRef } from 'react';
import { AgentChat as AgentChatElement, type AgentState } from 'site-operator';
import 'site-operator';

export interface AgentChatProps {
  backendUrl?: string;
  appName?: string;
  agentAvatar?: string;
  disclaimer?: string;
  emptyText?: string;
  inspector?: boolean;
  interceptor?: boolean;
  appContext?: AgentState;
  className?: string;
}

export const AgentChat: React.FC<AgentChatProps> = ({
  backendUrl,
  appName,
  agentAvatar,
  disclaimer,
  emptyText,
  inspector,
  interceptor,
  appContext,
  className
}) => {
  const ref = useRef<AgentChatElement>(null);

  useEffect(() => {
    if (ref.current && appContext) {
      ref.current.setAppContext(appContext);
    }
  }, [appContext]);

  return (
    <agent-chat
      ref={ref}
      backend-url={backendUrl}
      app-name={appName}
      agent-avatar={agentAvatar}
      disclaimer={disclaimer}
      empty-text={emptyText}
      inspector={inspector ? "true" : undefined}
      interceptor={interceptor ? true : undefined}
      class={className}
    />
  );
};

import React, { useEffect, useRef } from 'react';
import { AgentChat as AgentChatElement, type AgentState } from 'site-operator';
import 'site-operator';

export interface AgentChatProps {
  backendUrl?: string;
  appName?: string;
  agentAvatar?: string;
  inspector?: boolean;
  appContext?: AgentState;
  className?: string;
}

export const AgentChat: React.FC<AgentChatProps> = ({
  backendUrl,
  appName,
  agentAvatar,
  inspector,
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
      inspector={inspector ? "true" : undefined}
      class={className}
    />
  );
};

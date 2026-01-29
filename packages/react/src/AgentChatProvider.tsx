import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { AgentChat as AgentChatElement, ChatController, Action, ExecutePlanResult } from 'site-operator';
import { AgentChat, type AgentChatProps } from './AgentChat';
import { useChatPortal } from './useChatPortal';

const AgentChatControllerContext = createContext<ChatController | null>(null);
const AgentChatMountContext = createContext<((node: HTMLElement | null) => void) | null>(null);

export function useAgentChatController(): ChatController | null {
  return useContext(AgentChatControllerContext);
}

export type AgentChatMountProps = React.HTMLAttributes<HTMLDivElement>;

export const AgentChatMount: React.FC<AgentChatMountProps> = ({ children, ...props }) => {
  const setMountNode = useContext(AgentChatMountContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!setMountNode) return;
    setMountNode(ref.current);
    return () => {
      setMountNode(null);
    };
  }, [setMountNode]);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
};

export type AgentChatProviderProps = AgentChatProps & {
  children?: React.ReactNode;
  handlers?: {
    executePlan?: (plan: Action) => Promise<ExecutePlanResult>;
  };
};

export const AgentChatProvider: React.FC<AgentChatProviderProps> = ({
  children,
  context,
  handlers,
  ...props
}) => {
  const [chatElement, setChatElement] = useState<AgentChatElement | null>(null);
  const controller = useChatPortal(context?.appContext, { element: chatElement, handlers });
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  return (
    <AgentChatControllerContext.Provider value={controller}>
      <AgentChatMountContext.Provider value={setMountNode}>
        {children}
        {mountNode
          ? createPortal(<AgentChat ref={setChatElement} context={context} {...props} />, mountNode)
          : null}
      </AgentChatMountContext.Provider>
    </AgentChatControllerContext.Provider>
  );
};

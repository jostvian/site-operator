import { useEffect } from 'react';
import { chatPortalService, type PortalSpec } from 'site-operator';

/**
 * A hook to register a Chat Portal specification for the agent.
 * This allows the agent to navigate and control the host application.
 * @param spec The PortalSpec defining navigation graph and actions.
 */
export function useChatPortal(spec: PortalSpec) {
    useEffect(() => {
        chatPortalService.registerPortal(spec);
    }, [spec]);
}

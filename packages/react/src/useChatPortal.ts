import { useEffect } from 'react';
import { chatPortalService, type AppContext } from 'site-operator';


/**
 * A hook to register a Chat Portal specification for the agent.
 * This allows the agent to navigate and control the host application.
 * @param context The AppContext defining site, user and navigation.
 */
export function useChatPortal(context: AppContext) {
    useEffect(() => {
        chatPortalService.registerPortal(context);
    }, [context]);
}


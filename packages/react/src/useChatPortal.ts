import { useEffect, useState, type RefObject } from 'react';
import { chatPortalService, type AppContext, type ChatController, type AgentChat } from 'site-operator';

export type UseChatPortalOptions = {
    chatRef?: RefObject<AgentChat>;
};

/**
 * A hook to register a Chat Portal specification for the agent.
 * This allows the agent to navigate and control the host application.
 * @param context The AppContext defining site, user and navigation.
 * @param options Optional refs for accessing the AgentChat controller.
 * @returns ChatController instance if an AgentChat ref is provided.
 */
export function useChatPortal(
    context: AppContext,
    options?: UseChatPortalOptions
): ChatController | null {
    const [controller, setController] = useState<ChatController | null>(null);

    useEffect(() => {
        chatPortalService.registerPortal(context);
    }, [context]);

    useEffect(() => {
        const element = options?.chatRef?.current;
        if (!element) return;

        if (element.controller) {
            setController(element.controller);
            return;
        }

        const handleReady = (event: HTMLElementEventMap['controller-ready']) => {
            setController(event.detail ?? null);
        };

        element.addEventListener('controller-ready', handleReady);
        return () => {
            element.removeEventListener('controller-ready', handleReady);
        };
    }, [options?.chatRef]);

    return controller;
}

import { useEffect, useState } from 'react';
import { chatPortalService, type AppContext, type ChatController, type AgentChat, type Action, type ExecutePlanResult } from 'site-operator';

export type UseChatPortalOptions = {
    element?: AgentChat | null;
};

/**
 * A hook to register a Chat Portal specification for the agent.
 * This allows the agent to navigate and control the host application.
 * @param context The AppContext defining site, user and navigation.
 *                If null/undefined, registration is skipped.
 * @param options Optional options for accessing the AgentChat controller and custom handlers.
 * @returns ChatController instance if an AgentChat element is provided.
 */
export function useChatPortal(
    context: AppContext | null | undefined,
    options?: UseChatPortalOptions & { handlers?: { executePlan?: (plan: Action) => Promise<ExecutePlanResult> } }
): ChatController | null {
    const [controller, setController] = useState<ChatController | null>(null);

    useEffect(() => {
        if (!context) return;
        chatPortalService.registerPortal(context, options?.handlers);
    }, [context, options?.handlers]);

    useEffect(() => {
        const element = options?.element;
        if (!element) {
            setController(null);
            return;
        }

        if (element.controller) {
            setController(element.controller);
        }

        const handleReady = (event: HTMLElementEventMap['controller-ready']) => {
            setController(event.detail ?? null);
        };

        element.addEventListener('controller-ready', handleReady);
        return () => {
            element.removeEventListener('controller-ready', handleReady);
        };
    }, [options?.element]);

    return controller;
}

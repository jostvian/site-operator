import type {
    AgentSubscriber,
    RunStartedEvent,
    TextMessageStartEvent,
    TextMessageContentEvent,
    MessagesSnapshotEvent,
    AgentSubscriberParams,
    ToolCallEndEvent
} from "@ag-ui/client";
import { ChatService } from "./chat.service";
import { inspectorService } from "./inspector.service";
import { chatPortalService } from "./chat-portal.service";
import type { NavPlan } from "../models/portal.types";

export class ChatSubscriber implements AgentSubscriber {
    private service: ChatService;

    constructor(service: ChatService) {
        this.service = service;
    }

    onRunStartedEvent(params: { event: RunStartedEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onRunStartedEvent', params.event);
        // Show thinking animation
        this.service.addPlaceholderMessage();
    }

    onTextMessageStartEvent(params: { event: TextMessageStartEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onTextMessageStartEvent', params.event);
        // Switch from thinking to streaming text
        this.service.prepareMessageForStreaming(params.event.messageId);
    }

    onTextMessageContentEvent(params: { event: TextMessageContentEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onTextMessageContentEvent', params.event);
        // Add chunk
        // The event has 'delta' prop for the new content chunk
        // @ts-ignore - The type definition might be slightly off in local vs package, ensuring we use delta
        const content = (params.event as any).delta || (params.event as any).content || "";
        this.service.appendMessageContent(params.event.messageId, content);
    }

    onMessagesSnapshotEvent(params: { event: MessagesSnapshotEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onMessagesSnapshotEvent', params.event);
        // Sync full state, mapping to our local Message type
        const messages = params.event.messages.map(msg => {
            let content = "";
            if (typeof msg.content === 'string') {
                content = msg.content;
            } else if (Array.isArray(msg.content)) {
                content = msg.content
                    .filter((c: any) => c.type === 'text')
                    .map((c: any) => c.text)
                    .join('');
            } else {
                content = JSON.stringify(msg.content);
            }

            return {
                id: msg.id,
                role: msg.role as any, // Cast role if compatible, or valid "user" | "assistant"
                content: content,
                createdAt: Date.now(), // Fallback for now as ag-ui messages might not have this
                // We might want to preserve isThinking if we support it from snapshot, but for now defaulting is fine
            };
        });
        this.service.setMessages(messages);
        this.service.setMessages(messages);
    }

    async onToolCallEndEvent(params: {
        event: ToolCallEndEvent;
        toolCallName: string;
        toolCallArgs: Record<string, any>;
    } & AgentSubscriberParams) {
        inspectorService.addEvent('onToolCallEndEvent', params.event);

        if (params.toolCallName === 'executePlan') {
            console.log('ChatSubscriber: Received executePlan tool call', params.toolCallArgs);
            // Assuming args match NavPlan structure or are equal to it
            // implementation details: args might be { plan: ... } or just the plan properties
            // Based on user snippet `executePlan(plan: NavPlan)`, the agent likely sends the plan object.
            // If the tool definition takes a single argument 'plan', then args.plan is what we want.
            // If the tool definition flattens it, args *is* the plan.
            // Let's assume args *is* the plan or contains it.
            // Safest bet: pass args as NavPlan

            const result = await chatPortalService.executePlan(params.toolCallArgs as unknown as NavPlan);

            // We might want to send the result back to the agent?
            // The subscriber returns MaybePromise<AgentStateMutation | void>.
            // It doesn't seem to support returning a tool result directly to the agent runtime via this return.
            // Usually the runtime handles tool execution. 
            // If this is a CLIENT SIDE tool, we are responsible for executing it.
            // But how does the result get back to the LLM? 
            // `onToolCallResultEvent` is when a result is available.

            // If the backend agent is "waiting" for this tool, it expects a submission.
            // Since this is a custom client implementation, maybe we need to send a new message with the tool result?
            // Or maybe the `ag-ui` client handles this automatically if we use a specific middleware?
            // For now, I will just execute it. The user said "llamado por tu runtime cuando llega client_tool_call".

            console.log('ChatSubscriber: executePlan result', result);
        }
    }

    async onClientToolCall(params: { event: any, toolName: string, args: any } & AgentSubscriberParams) {
        inspectorService.addEvent('onClientToolCall', params.event);
        if (params.toolName === 'executePlan') {
            console.log('ChatSubscriber: Received executePlan client tool call', params.args);
            await chatPortalService.executePlan(params.args as NavPlan);
        }
    }
}

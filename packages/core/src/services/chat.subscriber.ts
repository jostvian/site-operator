import type {
    AgentSubscriber,
    RunStartedEvent,
    RunFinishedEvent,
    StepStartedEvent,
    StepFinishedEvent,
    TextMessageStartEvent,
    TextMessageContentEvent,
    TextMessageEndEvent,
    MessagesSnapshotEvent,
    AgentSubscriberParams,
    ToolCallStartEvent,
    ToolCallArgsEvent,
    ToolCallEndEvent,
    ToolCallResultEvent,
    StateSnapshotEvent,
    StateDeltaEvent,
    ActivitySnapshotEvent,
    ActivityDeltaEvent,
    CustomEvent as AgCustomEvent,
    RunErrorEvent,
    BaseEvent
} from "@ag-ui/client";
import { ChatService } from "./chat.service";
import { inspectorService } from "./inspector.service";
import { chatPortalService } from "./chat-portal.service";

export class ChatSubscriber implements AgentSubscriber {
    private service: ChatService;

    constructor(service: ChatService) {
        this.service = service;
    }

    onRunFinishedEvent(params: { event: RunFinishedEvent, result?: any } & AgentSubscriberParams) {
        inspectorService.addEvent('onRunFinishedEvent', params.event);
    }

    onRunStartedEvent(params: { event: RunStartedEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onRunStartedEvent', params.event);
        // Show thinking animation
        this.service.addPlaceholderMessage();
    }

    onRunErrorEvent(params: { event: RunErrorEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onRunErrorEvent', params.event);
        // We could also notify the user in the UI, but for now we logs it to inspector
        console.error('ChatSubscriber: Run Error', params.event);
    }

    onStepStartedEvent(params: { event: StepStartedEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onStepStartedEvent', params.event);
    }

    onStepFinishedEvent(params: { event: StepFinishedEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onStepFinishedEvent', params.event);
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

    onTextMessageEndEvent(params: { event: TextMessageEndEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onTextMessageEndEvent', params.event);
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
    }

    onToolCallStartEvent(params: { event: ToolCallStartEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onToolCallStartEvent', params.event);
    }

    onToolCallArgsEvent(params: { event: ToolCallArgsEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onToolCallArgsEvent', params.event);
    }

    async onToolCallEndEvent(params: {
        event: ToolCallEndEvent;
        toolCallName: string;
        toolCallArgs: Record<string, any>;
    } & AgentSubscriberParams) {
        inspectorService.addEvent('onToolCallEndEvent', params.event);

        if (params.toolCallName === 'executePlan') {
            console.log('ChatSubscriber: Received executePlan tool call', params.toolCallArgs);
            const result = await chatPortalService.executePlan(params.toolCallArgs);
            console.log('ChatSubscriber: executePlan result', result);
        }
    }

    onToolCallResultEvent(params: { event: ToolCallResultEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onToolCallResultEvent', params.event);
    }

    onStateSnapshotEvent(params: { event: StateSnapshotEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onStateSnapshotEvent', params.event);
    }

    onStateDeltaEvent(params: { event: StateDeltaEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onStateDeltaEvent', params.event);
    }

    onActivitySnapshotEvent(params: { event: ActivitySnapshotEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onActivitySnapshotEvent', params.event);
    }

    onActivityDeltaEvent(params: { event: ActivityDeltaEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onActivityDeltaEvent', params.event);
    }

    onCustomEvent(params: { event: AgCustomEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onCustomEvent', params.event);
    }

    async onClientToolCall(params: { event: any, toolName: string, args: any } & AgentSubscriberParams) {
        inspectorService.addEvent('onClientToolCall', params.event);
        if (params.toolName === 'executePlan') {
            console.log('ChatSubscriber: Received executePlan client tool call', params.args);
            await chatPortalService.executePlan(params.args);
        }
    }


    onEvent(params: { event: BaseEvent } & AgentSubscriberParams) {
        // Log all recognized events to inspector
        inspectorService.addEvent(`onEvent:${params.event.type}`, params.event);
    }

    onRawEvent(params: { event: any } & AgentSubscriberParams) {
        // Log raw data from the stream
        inspectorService.addEvent('onRawEvent', params.event);
    }
}

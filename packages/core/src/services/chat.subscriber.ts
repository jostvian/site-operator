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
import type { UIMessage } from "../models/chat.types.js";
import { a2uiService } from "./a2ui.service.js";
import type { Action } from "../models/portal.types.js";


export class ChatSubscriber implements AgentSubscriber {
    private service: ChatService;

    constructor(service: ChatService) {
        this.service = service;
    }

    onRunFinishedEvent(params: { event: RunFinishedEvent, result?: any } & AgentSubscriberParams) {
        inspectorService.addEvent('onRunFinishedEvent', params.event);
        this.service.cleanupThinkingPlaceholder();
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
        this.service.cleanupThinkingPlaceholder();
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

    onTextMessageContentEvent(params: { event: TextMessageContentEvent, textMessageBuffer: string } & AgentSubscriberParams) {
        inspectorService.addEvent('onTextMessageContentEvent', params.event);
        // Add chunk
        // The event has 'delta' prop for the new content chunk
        const content = params.event.delta || "";
        this.service.appendMessageContent(params.event.messageId, content);
    }


    onTextMessageEndEvent(params: { event: TextMessageEndEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onTextMessageEndEvent', params.event);
    }

    onMessagesSnapshotEvent(params: { event: MessagesSnapshotEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onMessagesSnapshotEvent', params.event);

        // Sync full state, mapping to our local Message type
        const messages: UIMessage[] = params.event.messages
            .filter(msg => {
                // Ignore 'tool' role messages (already handled in backend but library might resend)
                if (msg.role === 'tool') return false;

                // Ignore 'assistant' messages that only contain non-A2UI tool calls
                if (msg.role === 'assistant' && msg.toolCalls && msg.toolCalls.length > 0) {
                    const hasA2UITool = msg.toolCalls.some(tc => tc.function?.name?.startsWith('a2ui_'));
                    const hasContent = typeof msg.content === 'string' && msg.content.trim().length > 0;

                    // If it only has internal tools and no text content, hide it
                    if (!hasA2UITool && !hasContent) return false;
                }

                return true;
            })
            .map(msg => ({
                ...msg,
                createdAt: (msg as any).createdAt || Date.now(),
            }));
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
            const result = await chatPortalService.executePlan(params.toolCallArgs as Action);
            console.log('ChatSubscriber: executePlan result', result);
        }

        if (params.toolCallName === 'navigate_user') {
            console.log('ChatSubscriber: Received navigate_user tool call', params.toolCallArgs);
            const result = await chatPortalService.executePlan({
                type: 'navigate',
                toPath: params.toolCallArgs.path,
                reason: params.toolCallArgs.reason
            });
            console.log('ChatSubscriber: navigate_user result', result);
        }

        if (params.toolCallName === 'click_element') {
            console.log('ChatSubscriber: Received click_element tool call', params.toolCallArgs);
            const result = await chatPortalService.executePlan({
                type: 'click',
                targetId: params.toolCallArgs.target_id,
                reason: params.toolCallArgs.reason
            });
            console.log('ChatSubscriber: click_element result', result);
        }

        if (params.toolCallName === 'set_value') {
            console.log('ChatSubscriber: Received set_value tool call', params.toolCallArgs);
            const result = await chatPortalService.executePlan({
                type: 'setValue',
                targetId: params.toolCallArgs.target_id,
                value: params.toolCallArgs.value,
                reason: params.toolCallArgs.reason
            });
            console.log('ChatSubscriber: set_value result', result);
        }

        if (params.toolCallName === 'execute_ui_plan' || params.toolCallName === 'executePlan') {
            console.log('ChatSubscriber: Received UI plan tool call', params.toolCallArgs);
            const result = await chatPortalService.executePlan(params.toolCallArgs as Action);
            console.log('ChatSubscriber: UI plan result', result);
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

        if (params.event.activityType === 'a2ui') {
            a2uiService.processSnapshot(params.event);
        } else if (["navigation", "click", "setValue", "plan"].includes(params.event.activityType)) {
            chatPortalService.executePlan(params.event.content as Action);
        }
    }

    onActivityDeltaEvent(params: { event: ActivityDeltaEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onActivityDeltaEvent', params.event);
        // Delta processing is not supported by the current processor
    }

    onCustomEvent(params: { event: AgCustomEvent } & AgentSubscriberParams) {
        inspectorService.addEvent('onCustomEvent', params.event);
    }

    async onClientToolCall(params: { event: AgCustomEvent, toolName: string, args: Record<string, any> } & AgentSubscriberParams) {

        inspectorService.addEvent('onClientToolCall', params.event);
        if (params.toolName === 'executePlan') {
            console.log('ChatSubscriber: Received executePlan client tool call', params.args);
            await chatPortalService.executePlan(params.args as Action);
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

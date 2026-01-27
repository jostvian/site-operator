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
        const messages: UIMessage[] = params.event.messages.map(msg => ({
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
        // a2uiService.processSnapshot(params.event);
        if (params.event.activityType == "a2ui" && params.event.content.surfaceUpdate)
            this.service.addA2UIMessage(params.event);
        else if (params.event.activityType == "a2ui" && params.event.content.beginRendering)
            a2uiService.processMessages([params.event.content] as any)
        else if (params.event.activityType == "navigation")
            chatPortalService.executePlan(params.event.content as Action);
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

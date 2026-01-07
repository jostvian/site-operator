import type {
    AgentSubscriber,
    RunStartedEvent,
    TextMessageStartEvent,
    TextMessageContentEvent,
    MessagesSnapshotEvent,
    AgentSubscriberParams
} from "@ag-ui/client";
import { ChatService } from "./chat.service";

export class ChatSubscriber implements AgentSubscriber {
    private service: ChatService;

    constructor(service: ChatService) {
        this.service = service;
    }

    onRunStartedEvent(_params: { event: RunStartedEvent } & AgentSubscriberParams) {
        // Show thinking animation
        this.service.addPlaceholderMessage();
    }

    onTextMessageStartEvent(params: { event: TextMessageStartEvent } & AgentSubscriberParams) {
        // Switch from thinking to streaming text
        this.service.prepareMessageForStreaming(params.event.messageId);
    }

    onTextMessageContentEvent(params: { event: TextMessageContentEvent } & AgentSubscriberParams) {
        // Add chunk
        // The event has 'delta' prop for the new content chunk
        // @ts-ignore - The type definition might be slightly off in local vs package, ensuring we use delta
        const content = (params.event as any).delta || (params.event as any).content || "";
        this.service.appendMessageContent(params.event.messageId, content);
    }

    onMessagesSnapshotEvent(params: { event: MessagesSnapshotEvent } & AgentSubscriberParams) {
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
}

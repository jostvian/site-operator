import { v0_8 } from '@a2ui/lit';
import type { ActivitySnapshotEvent } from "@ag-ui/client";
import type { UIMessage } from '../models/chat.types';

/**
 * Service to manage A2UI message processing and surface updates.
 */
export class A2UIService extends EventTarget {
    public processor: v0_8.Types.MessageProcessor = v0_8.Data.createSignalA2uiMessageProcessor();
    private surfaceMessageRegistry = new Map<string, UIMessage>();
    private processedMessageIds = new Set<string>();

    /**
     * Initializes the A2UI service.
     */
    constructor() {
        super();
        // Initialize with empty messages to clear surfaces
    }

    /**
     * Clears the surface registry and processed messages cache.
     * Use this when starting a new conversation.
     */
    public clearRegistry() {
        this.surfaceMessageRegistry.clear();
        this.processedMessageIds.clear();
    }

    /**
     * Resolves a value descriptor (literal or path) against a surface's data model.
     */
    public resolveValue(surfaceId: string, descriptor: any): any {
        if (!descriptor) return undefined;
        if (descriptor.literalString !== undefined) return descriptor.literalString;
        if (descriptor.literalNumber !== undefined) return descriptor.literalNumber;
        if (descriptor.literalBoolean !== undefined) return descriptor.literalBoolean;
        if (descriptor.literalArray !== undefined) return descriptor.literalArray;

        if (descriptor.path) {
            const surface = this.processor.getSurfaces().get(surfaceId);
            if (surface) {
                // Remove leading slash if present to match how keys are stored in many implementations
                const pathKey = descriptor.path.startsWith('/') ? descriptor.path.substring(1) : descriptor.path;
                const val = surface.dataModel.get(pathKey);
                if (val !== undefined) return val;
            }
            // Fallback if path is not in dataModel yet or surface not found
            console.warn(`A2UIService: Could not resolve path ${descriptor.path} for surface ${surfaceId}`);
        }
        return undefined;
    }

    private mapMessage(message: UIMessage): v0_8.Types.ServerToClientMessage[] {
        if (message.role !== 'assistant' || !message.toolCalls) {
            throw new Error("Unsupported message type for A2UI processing");
        }

        const mappedMessages: v0_8.Types.ServerToClientMessage[] = [];

        for (const toolCall of message.toolCalls) {
            if (toolCall.type !== 'function' || !toolCall.function) {
                continue;
            }

            const toolName = toolCall.function.name;
            const args = this.parseToolArguments(toolCall.function.arguments, toolName);
            if (!args) {
                continue;
            }

            if (toolName === 'a2ui_begin_rendering') {
                const beginRendering = this.mapBeginRendering(args);
                if (beginRendering) {
                    mappedMessages.push({ beginRendering });
                }
                continue;
            }

            if (toolName === 'a2ui_update_surface') {
                const surfaceUpdate = this.mapSurfaceUpdate(args);
                if (surfaceUpdate) {
                    mappedMessages.push({ surfaceUpdate });
                }
                continue;
            }

            if (toolName === 'a2ui_update_data_model') {
                const dataModelUpdate = this.mapDataModelUpdate(args);
                if (dataModelUpdate) {
                    mappedMessages.push({ dataModelUpdate });
                }
                continue;
            }

            if (toolName === 'a2ui_delete_surface') {
                const deleteSurface = this.mapDeleteSurface(args);
                if (deleteSurface) {
                    mappedMessages.push({ deleteSurface });
                }
                continue;
            }
        }

        return mappedMessages;
    }

    private parseToolArguments(rawArgs: unknown, toolName: string): Record<string, unknown> | null {
        if (rawArgs == null) {
            console.warn(`A2UIService: Missing arguments for ${toolName}`);
            return null;
        }

        if (typeof rawArgs === "string") {
            const trimmedArgs = rawArgs.trim();
            if (trimmedArgs === "") {
                return {};
            }
            try {
                return JSON.parse(trimmedArgs) as Record<string, unknown>;
            } catch (error) {
                console.warn(`A2UIService: Failed to parse arguments for ${toolName}`, error);
                return null;
            }
        }

        if (typeof rawArgs === "object") {
            return rawArgs as Record<string, unknown>;
        }

        console.warn(`A2UIService: Unsupported arguments type for ${toolName}`);
        return null;
    }

    private mapBeginRendering(args: Record<string, unknown>): v0_8.Types.BeginRenderingMessage | null {
        const surfaceId = this.getSurfaceId(args);
        const root = this.getRootComponentId(args);

        if (!surfaceId || !root) {
            console.warn("A2UIService: Missing surfaceId or root for begin rendering");
            return null;
        }

        const styles = (typeof args.styles === "object" && args.styles) ? (args.styles as Record<string, string>) : undefined;
        return styles ? { surfaceId, root, styles } : { surfaceId, root };
    }

    private mapSurfaceUpdate(args: Record<string, unknown>): v0_8.Types.SurfaceUpdateMessage | null {
        const surfaceId = this.getSurfaceId(args);

        if (!surfaceId) {
            console.warn("A2UIService: Missing surfaceId for surface update");
            return null;
        }

        const components = Array.isArray(args.components) ? args.components : [];
        return {
            surfaceId,
            components: components as v0_8.Types.ComponentInstance[]
        };
    }

    private mapDataModelUpdate(args: Record<string, unknown>): v0_8.Types.DataModelUpdate | null {
        const surfaceId = this.getSurfaceId(args);

        if (!surfaceId) {
            console.warn("A2UIService: Missing surfaceId for data model update");
            return null;
        }

        const contents = this.normalizeValueMapArray(args.contents);
        const dataModelUpdate: v0_8.Types.DataModelUpdate = {
            surfaceId,
            contents
        };

        if (typeof args.path === "string") {
            dataModelUpdate.path = args.path;
        }

        return dataModelUpdate;
    }

    private normalizeDataModelUpdate(update: v0_8.Types.DataModelUpdate): v0_8.Types.DataModelUpdate {
        const surfaceId = update.surfaceId || (update as any).surface_id;
        const normalized: v0_8.Types.DataModelUpdate = {
            surfaceId,
            contents: this.normalizeValueMapArray(update.contents)
        };

        if (typeof update.path === "string") {
            normalized.path = update.path;
        }

        console.log(`A2UIService: Normalized DataModelUpdate for ${surfaceId}`, normalized);
        return normalized;
    }

    private mapDeleteSurface(args: Record<string, unknown>): v0_8.Types.DeleteSurfaceMessage | null {
        const surfaceId = this.getSurfaceId(args);

        if (!surfaceId) {
            console.warn("A2UIService: Missing surfaceId for delete surface");
            return null;
        }

        return { surfaceId };
    }

    private getSurfaceId(args: Record<string, unknown>): string | null {
        const surfaceId = args.surfaceId ?? args.surface_id;

        if (typeof surfaceId === "string" && surfaceId.trim()) {
            return surfaceId;
        }

        if (typeof surfaceId === "number") {
            return String(surfaceId);
        }

        return null;
    }

    private getRootComponentId(args: Record<string, unknown>): string | null {
        const root =
            args.root ??
            args.rootComponentId ??
            args.root_component ??
            args.root_component_id;

        if (typeof root === "string" && root.trim()) {
            return root;
        }

        if (typeof root === "number") {
            return String(root);
        }

        return null;
    }

    private normalizeValueMapArray(contents: unknown): v0_8.Types.ValueMap[] {
        if (!Array.isArray(contents)) {
            return [];
        }

        return contents
            .filter((entry) => entry && typeof entry === "object" && ("key" in entry || "path" in entry))
            .map((entry) => this.normalizeValueMapEntry(entry as Record<string, unknown>));
    }

    private normalizeValueMapEntry(entry: Record<string, unknown>): v0_8.Types.ValueMap {
        const normalized: Record<string, unknown> = { ...entry };

        if ("value_string" in entry) {
            normalized.valueString = entry["value_string"];
        }
        if ("valueString" in entry) {
            normalized.valueString = entry["valueString"];
        }

        if ("value_number" in entry) {
            normalized.valueNumber = entry["value_number"];
        }
        if ("valueNumber" in entry) {
            normalized.valueNumber = entry["valueNumber"];
        }
        if ("value_boolean" in entry) {
            normalized.valueBoolean = entry["value_boolean"];
        }
        if ("valueBoolean" in entry) {
            normalized.valueBoolean = entry["valueBoolean"];
        }

        // Handle generic 'value' and 'path' aliases often used by agents
        if (!("key" in normalized) && "path" in entry) {
            normalized.key = entry["path"];
        }

        if (!("valueString" in normalized) && !("valueNumber" in normalized) && !("valueBoolean" in normalized) && "value" in entry) {
            const val = entry["value"];
            if (typeof val === 'string') normalized.valueString = val;
            else if (typeof val === 'number') normalized.valueNumber = val;
            else if (typeof val === 'boolean') normalized.valueBoolean = val;
        }

        const valueMap = entry["valueMap"] ?? entry["value_map"];
        if (valueMap !== undefined) {
            normalized.valueMap = this.normalizeValueMapArray(valueMap);
        }

        delete normalized["value_string"];
        delete normalized["value_number"];
        delete normalized["value_boolean"];
        delete normalized["value_map"];

        if (typeof normalized.key !== "string") {
            normalized.key = String(normalized.key ?? "");
        }

        // Normalize: remove leading slash from keys to match path resolution
        let key = normalized.key as string;
        if (key.startsWith('/')) {
            normalized.key = key.substring(1);
        }

        return normalized as v0_8.Types.ValueMap;
    }

    private isServerToClientMessage(message: unknown): message is v0_8.Types.ServerToClientMessage {
        if (!message || typeof message !== "object") {
            return false;
        }

        const candidate = message as Record<string, unknown>;
        const content = candidate.content as Record<string, unknown> | undefined;
        const hasA2UIPayload = content !== null && typeof content === 'object' && (
            "beginRendering" in content ||
            "surfaceUpdate" in content
        );

        return (
            "beginRendering" in candidate ||
            "begin_rendering" in candidate ||
            "surfaceUpdate" in candidate ||
            "surface_update" in candidate ||
            "dataModelUpdate" in candidate ||
            "data_model_update" in candidate ||
            "deleteSurface" in candidate ||
            "delete_surface" in candidate ||
            hasA2UIPayload
        );
    }

    private normalizeServerMessage(message: v0_8.Types.ServerToClientMessage | Record<string, unknown>): v0_8.Types.ServerToClientMessage {
        const messageRecord = message as Record<string, unknown>;
        if ("beginRendering" in messageRecord || "surfaceUpdate" in messageRecord || "dataModelUpdate" in messageRecord || "deleteSurface" in messageRecord) {
            const existing = message as v0_8.Types.ServerToClientMessage;
            if (existing.dataModelUpdate) {
                return { ...existing, dataModelUpdate: this.normalizeDataModelUpdate(existing.dataModelUpdate) };
            }
            return existing;
        }

        const normalized: v0_8.Types.ServerToClientMessage = {};

        const beginRenderingArgs = messageRecord["begin_rendering"];
        if (beginRenderingArgs && typeof beginRenderingArgs === "object") {
            const beginRendering = this.mapBeginRendering(beginRenderingArgs as Record<string, unknown>);
            if (beginRendering) {
                normalized.beginRendering = beginRendering;
            }
        }

        const surfaceUpdateArgs = messageRecord["surface_update"];
        if (surfaceUpdateArgs && typeof surfaceUpdateArgs === "object") {
            const surfaceUpdate = this.mapSurfaceUpdate(surfaceUpdateArgs as Record<string, unknown>);
            if (surfaceUpdate) {
                normalized.surfaceUpdate = surfaceUpdate;
            }
        }

        const dataModelUpdateArgs = messageRecord["data_model_update"];
        if (dataModelUpdateArgs && typeof dataModelUpdateArgs === "object") {
            const dataModelUpdate = this.mapDataModelUpdate(dataModelUpdateArgs as Record<string, unknown>);
            if (dataModelUpdate) {
                normalized.dataModelUpdate = dataModelUpdate;
            }
        }

        const deleteSurfaceArgs = messageRecord["delete_surface"];
        if (deleteSurfaceArgs && typeof deleteSurfaceArgs === "object") {
            const deleteSurface = this.mapDeleteSurface(deleteSurfaceArgs as Record<string, unknown>);
            if (deleteSurface) {
                normalized.deleteSurface = deleteSurface;
            }
        }

        return normalized;
    }

    processMessages(messages: UIMessage[]) {
        const mappedMessages: v0_8.Types.ServerToClientMessage[] = [];

        for (const message of messages) {
            // Check if we already fully processed this message to avoid double calls to beginRendering
            if (this.processedMessageIds.has(message.id) && !message.isThinking) {
                continue;
            }

            // Check if message itself is an A2UI message
            if (this.isServerToClientMessage(message)) {
                mappedMessages.push(this.normalizeServerMessage(message));
                continue;
            }

            // Check if it's a tool message with JSON content
            if (message.role === 'tool' && typeof message.content === 'string') {
                try {
                    const parsed = JSON.parse(message.content);
                    if (parsed.role === 'activity' && parsed.activity_type === 'a2ui' && parsed.content) {
                        const content = parsed.content;
                        if (this.isServerToClientMessage(content)) {
                            mappedMessages.push(this.normalizeServerMessage(content));
                        } else {
                            const items = Array.isArray(content) ? content : [content];
                            for (const item of items) {
                                if (this.isServerToClientMessage(item)) {
                                    mappedMessages.push(this.normalizeServerMessage(item));
                                }
                            }
                        }
                    }
                } catch (e) {
                    // Not valid JSON or wrong format, ignore
                }
                continue;
            }

            // Check if it's an activity message containing A2UI payload
            const msg = message as any;
            if (msg.role === 'activity' && msg.activityType === 'a2ui' && msg.content) {
                if (this.isServerToClientMessage(msg.content)) {
                    mappedMessages.push(this.normalizeServerMessage(msg.content));
                } else {
                    // It might be a raw message or array of messages
                    const content = msg.content;
                    const items = Array.isArray(content) ? content : [content];
                    for (const item of items) {
                        if (this.isServerToClientMessage(item)) {
                            mappedMessages.push(this.normalizeServerMessage(item));
                        }
                    }
                }
                continue;
            }

            if (message.role === 'assistant' && message.toolCalls) {
                mappedMessages.push(...this.mapMessage(message));
            }
        }

        if (mappedMessages.length === 0) {
            return;
        }

        if (mappedMessages.length > 0) {
            console.log("A2UIService: Processing mapped messages:", JSON.stringify(mappedMessages, null, 2));
            this.processor.processMessages(mappedMessages);

            // Mark as processed
            for (const message of messages) {
                this.processedMessageIds.add(message.id);
            }

            this.dispatchEvent(new CustomEvent('processor-update'));
        }
    }

    /**
     * Consolidates A2UI messages to implement "Surface Consolidation".
     * Only begin_rendering (or the first update for a surface) creates a visual message.
     * Subsequent updates for the same surface_id refresh the internal state without generating new bubbles.
     * 
     * @param newMessage The new message to process.
     * @param currentMessages The current list of visual messages.
     * @returns The updated list of visual messages.
     */
    public consolidateStream(newMessage: UIMessage, currentMessages: UIMessage[]): UIMessage[] {
        const payloads = this.getA2UIPayloads(newMessage);

        // If not an A2UI message, add it normally
        if (payloads.length === 0) {
            return [...currentMessages, newMessage];
        }

        let isUpdateForExistingSurface = false;
        let isNewSurfaceCreation = false;

        for (const payload of payloads) {
            const sid = (payload.beginRendering || payload.surfaceUpdate || payload.dataModelUpdate || payload.deleteSurface)?.surfaceId;
            if (!sid) continue;

            if (payload.beginRendering) {
                if (!this.surfaceMessageRegistry.has(sid)) {
                    this.surfaceMessageRegistry.set(sid, newMessage);
                    isNewSurfaceCreation = true;
                } else {
                    // It's a re-initialization of an existing surface.
                    // We treat it as an update to keep the same bubble.
                    isUpdateForExistingSurface = true;
                }
            } else if (payload.surfaceUpdate || payload.dataModelUpdate) {
                if (this.surfaceMessageRegistry.has(sid)) {
                    isUpdateForExistingSurface = true;
                } else {
                    // Update for unknown surface, register this message as the parent bubble
                    this.surfaceMessageRegistry.set(sid, newMessage);
                    isNewSurfaceCreation = true;
                }
            } else if (payload.deleteSurface) {
                if (this.surfaceMessageRegistry.has(sid)) {
                    isUpdateForExistingSurface = true;
                }
            }
        }

        // Procesa los datos inmediatamente en el procesador interno de A2UI.
        // Esto asegura que la burbuja original (que usa este mismo procesador) se actualice "in-place".
        this.processor.processMessages(payloads);

        // Marcamos como procesado para evitar que processMessages lo vuelva a procesar
        this.processedMessageIds.add(newMessage.id);
        this.dispatchEvent(new CustomEvent('processor-update'));

        // Si el mensaje es puramente una actualización de algo que ya tiene burbuja,
        // lo descartamos del array visual para evitar spam de burbujas técnicas.
        if (isUpdateForExistingSurface && !isNewSurfaceCreation) {
            console.log(`A2UIService: Consolidating update for surface(s). Discarding visual message ${newMessage.id}`);
            return currentMessages;
        }

        return [...currentMessages, newMessage];
    }

    processMessage(message: UIMessage) {
        this.processMessages([message]);
    }

    /**
     * Processes an activity snapshot event.
     * @param event The activity snapshot event.
     */
    processSnapshot(event: ActivitySnapshotEvent) {
        if (event.activityType === 'a2ui' && event.content) {
            const content = event.content;
            const rawMessages = Array.isArray(content) ? content : [content];
            const surfaceIds = this.getSurfaceIdsFromEvent(event);

            // If it's a replace/snapshot, we should clear the state for these surfaces first
            // to ensure we don't have leftover components from previous snapshots.
            const prefixMessages = (event.replace !== false) ?
                surfaceIds.map(id => ({ deleteSurface: { surfaceId: id } })) : [];

            // Auto-fix: If we have a surfaceUpdate but no corresponding root in the processor,
            // or if the agent sent a new root id in components but didn't update beginRendering.
            const messages = rawMessages.map(m => {
                if (m.surfaceUpdate || m.surface_update) {
                    const update = m.surfaceUpdate || m.surface_update;
                    const surfaceId = update.surfaceId || update.surface_id;
                    const components = update.components || [];

                    if (surfaceId && components.length > 0) {
                        const surface = this.processor.getSurfaces().get(surfaceId);
                        const currentRootId = surface?.rootComponentId;

                        // Check if current rootId exists in the NEW components
                        const rootExists = components.some((c: any) => c.id === currentRootId);

                        if (!rootExists || !currentRootId) {
                            // Find a likely root: first component or one not referenced elsewhere (impl. first for simplicity)
                            const likelyRootId = components[0].id;
                            console.warn(`A2UIService: Auto-fixing root mismatch for surface ${surfaceId}. Mapeando root a ${likelyRootId}`);

                            // Return BOTH a beginRendering to fix the root and the original update
                            return [
                                { beginRendering: { surfaceId, root: likelyRootId } },
                                m
                            ];
                        }
                    }
                }
                return m;
            }).flat();

            const finalMessages = [...prefixMessages, ...messages].map(m => this.normalizeServerMessage(m as any));
            console.log("A2UIService: Processing messages (fixed & normalized)", JSON.stringify(finalMessages, null, 2));
            this.processor.processMessages(finalMessages);

            // Post-process log
            const surfaces = Array.from(this.processor.getSurfaces().entries());
            console.log("A2UIService: Estado del procesador tras procesado:", surfaces.map(([id, s]) => ({
                id,
                root: s.rootComponentId,
                components: s.components.size,
                hasTree: !!s.componentTree
            })));
        }
    }

    getSurfaceIdsFromEvent(event: ActivitySnapshotEvent): string[] {
        if (event.activityType !== 'a2ui' || !event.content) return [];
        const content = event.content;
        const messages = Array.isArray(content) ? content : [content];
        const ids = new Set<string>();

        messages.forEach(m => {
            const payload = m.beginRendering || m.begin_rendering || m.surfaceUpdate || m.surface_update || m.deleteSurface || m.delete_surface;
            const sid = payload?.surfaceId || payload?.surface_id;
            if (sid) ids.add(sid);
        });

        return Array.from(ids);
    }

    /**
     * Checks if a message contains ONLY beginRendering payloads.
     */
    isBeginRenderingOnly(message: UIMessage): boolean {
        const payloads = this.getA2UIPayloads(message);
        if (payloads.length === 0) return false;
        return payloads.every(p => {
            const hasBegin = !!p.beginRendering;
            const hasOther = !!p.surfaceUpdate || !!p.dataModelUpdate || !!p.deleteSurface;
            return hasBegin && !hasOther;
        });
    }

    /**
     * Checks if a message contains A2UI activity that should be displayed as a visual bubble.
     * Only assistant and activity roles are considered for visual representation.
     */
    isA2UIMessage(message: UIMessage): boolean {
        if (!message) return false;

        // Technical roles like 'tool' or 'system' should never produce their own A2UI bubbles
        if (message.role !== 'assistant' && message.role !== 'activity') return false;

        if (message.role === 'activity' && (message as any).activityType === 'a2ui') return true;

        if (message.role === 'assistant' && message.toolCalls) {
            return message.toolCalls.some(tc => tc.function?.name.startsWith('a2ui_'));
        }

        return false;
    }

    /**
     * Extracts A2UI payloads from a message for processing.
     * Unlike isA2UIMessage, this can look inside 'tool' messages to extract data updates
     * that might be mirrored from the activity stream.
     */
    getA2UIPayloads(message: UIMessage): v0_8.Types.ServerToClientMessage[] {
        const payloads: v0_8.Types.ServerToClientMessage[] = [];
        if (!message) return payloads;

        if (message.role === 'assistant' && message.toolCalls) {
            payloads.push(...this.mapMessage(message));
        } else if (message.role === 'activity' && (message as any).activityType === 'a2ui' && message.content) {
            const content = message.content;
            const items = Array.isArray(content) ? content : [content];
            items.forEach(item => {
                if (this.isServerToClientMessage(item)) {
                    payloads.push(this.normalizeServerMessage(item));
                }
            });
        } else if (message.role === 'tool' && typeof message.content === 'string') {
            try {
                // Technical mapping: extract activities wrapped inside tool outputs
                const parsed = JSON.parse(message.content);

                if ((parsed.role === 'activity' || parsed.activity_type === 'a2ui') && parsed.content) {
                    const content = parsed.content;
                    const items = Array.isArray(content) ? content : [content];
                    items.forEach(item => {
                        if (this.isServerToClientMessage(item)) {
                            payloads.push(this.normalizeServerMessage(item));
                        }
                    });
                } else if (this.isServerToClientMessage(parsed)) {
                    payloads.push(this.normalizeServerMessage(parsed));
                }
            } catch { }
        }

        return payloads;
    }
}

export const a2uiService = new A2UIService();

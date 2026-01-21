import { v0_8 } from '@a2ui/lit';

/**
 * Service to manage A2UI message processing and surface updates.
 */
export class A2UIService {
    private processor: v0_8.Types.MessageProcessor = v0_8.Data.createSignalA2uiMessageProcessor();

    /**
     * Initializes the A2UI service.
     */
    constructor() {
        // Initialize with empty messages to clear surfaces
        this.processor.processMessages([]);
    }
}
import type { ChatPortalAPI, AppContext } from "../models/portal.types";

export class ChatPortalService extends EventTarget implements ChatPortalAPI {
    private _context: AppContext | null = null;
    private static _instance: ChatPortalService;

    private constructor() {
        super();
    }

    public static getInstance(): ChatPortalService {
        if (!ChatPortalService._instance) {
            ChatPortalService._instance = new ChatPortalService();
        }
        return ChatPortalService._instance;
    }

    registerPortal(context: AppContext): void {
        console.log('Registering app context', context);
        this._context = context;
        this.dispatchEvent(new CustomEvent('portal-registered', { detail: context }));
    }

    async executePlan(plan: any): Promise<{ status: "ok" | "error"; details?: any }> {
        if (!this._context) {
            console.warn('No portal registered. Cannot execute plan.');
            return { status: "error", details: "No portal registered" };
        }

        console.log('Executing plan (simplified):', plan);
        // TODO: Implement execution logic based on ClickTarget actions
        return { status: "ok" };
    }

    public get context(): AppContext | null {
        return this._context;
    }

    /**
     * @deprecated Use context instead
     */
    public get specs(): any {
        return this._context;
    }
}

export const chatPortalService = ChatPortalService.getInstance();


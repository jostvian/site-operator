import type { ChatPortalAPI, AppContext, ExecutePlanResult, ClickAction } from "../models/portal.types.js";


export class ChatPortalService extends EventTarget implements ChatPortalAPI {
    private _context: AppContext | null = null;
    private static _instance: ChatPortalService;

    private _executePlanHandler: ((plan: ClickAction) => Promise<ExecutePlanResult>) | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): ChatPortalService {
        if (!ChatPortalService._instance) {
            ChatPortalService._instance = new ChatPortalService();
        }
        return ChatPortalService._instance;
    }

    registerPortal(context: AppContext, handlers?: { executePlan?: (plan: ClickAction) => Promise<ExecutePlanResult> }): void {
        console.log('Registering app context', context);
        this._context = context;
        if (handlers?.executePlan) {
            this._executePlanHandler = handlers.executePlan;
        }
        this.dispatchEvent(new CustomEvent('portal-registered', { detail: context }));
    }

    async executePlan(plan: ClickAction): Promise<ExecutePlanResult> {

        if (this._executePlanHandler) {
            return this._executePlanHandler(plan);
        }

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
    public get specs(): AppContext | null {

        return this._context;
    }
}

export const chatPortalService = ChatPortalService.getInstance();


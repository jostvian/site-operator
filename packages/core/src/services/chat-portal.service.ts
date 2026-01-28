import type { ChatPortalAPI, AppContext, ExecutePlanResult, Action } from "../models/portal.types.js";


export class ChatPortalService extends EventTarget implements ChatPortalAPI {
    private _context: AppContext | null = null;
    private _visibleTargetIds: Set<string> = new Set();
    private static _instance: ChatPortalService;

    private _executePlanHandler: ((plan: Action) => Promise<ExecutePlanResult>) | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): ChatPortalService {
        if (!ChatPortalService._instance) {
            ChatPortalService._instance = new ChatPortalService();
        }
        return ChatPortalService._instance;
    }

    registerPortal(context: AppContext, handlers?: { executePlan?: (plan: Action) => Promise<ExecutePlanResult> }): void {
        console.log('Registering app context', context);
        this._context = context;
        if (handlers?.executePlan) {
            this._executePlanHandler = handlers.executePlan;
        }
        this.dispatchEvent(new CustomEvent('portal-registered', { detail: context }));
    }

    setVisibleTargets(ids: string[]): void {
        this._visibleTargetIds = new Set(ids);
        this.dispatchEvent(new CustomEvent('targets-updated', { detail: ids }));
    }

    async executePlan(plan: Action): Promise<ExecutePlanResult> {
        if (plan.type === 'plan') {
            const steps = (plan as any).steps as Action[];
            console.log(`ChatPortalService: Executing multi-step plan with ${steps.length} steps.`);
            for (const step of steps) {
                const result = await this.executePlan(step);
                if (result.status === 'error') {
                    return result;
                }
            }
            return { status: "ok" };
        }

        if (plan.type === 'click' || plan.type === 'setValue') {
            const targetId = (plan as any).targetId;
            console.log(`ChatPortalService: Waiting for target "${targetId}" for action "${plan.type}"...`);
            const found = await this._waitForTarget(targetId);
            if (!found) {
                return { status: "error", details: `Target "${targetId}" not found or not visible after timeout.` };
            }
        }

        if (this._executePlanHandler) {
            return this._executePlanHandler(plan);
        }

        if (!this._context) {
            console.warn('No portal registered. Cannot execute plan.');
            return { status: "error", details: "No portal registered" };
        }

        console.log('Executing plan (simplified):', plan);
        return { status: "ok" };
    }

    private _waitForTarget(targetId: string, timeout = 10000): Promise<boolean> {
        if (this._visibleTargetIds.has(targetId)) {
            return Promise.resolve(true);
        }

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.removeEventListener('targets-updated', handler);
                resolve(false);
            }, timeout);

            const handler = () => {
                if (this._visibleTargetIds.has(targetId)) {
                    clearTimeout(timer);
                    this.removeEventListener('targets-updated', handler);
                    resolve(true);
                }
            };

            this.addEventListener('targets-updated', handler);
        });
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


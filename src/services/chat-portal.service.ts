import { ChatPortalAPI, NavPlan, PortalSpec } from '../models/portal.types';

export class ChatPortalService implements ChatPortalAPI {
    private _spec: PortalSpec | null = null;
    private static _instance: ChatPortalService;

    private constructor() { }

    public static getInstance(): ChatPortalService {
        if (!ChatPortalService._instance) {
            ChatPortalService._instance = new ChatPortalService();
        }
        return ChatPortalService._instance;
    }

    registerPortal(spec: PortalSpec): void {
        console.log('Registering portal spec', spec);
        this._spec = spec;
    }

    async executePlan(plan: NavPlan): Promise<{ status: "ok" | "error"; details?: any }> {
        if (!this._spec) {
            console.warn('No portal registered. Cannot execute plan.');
            return { status: "error", details: "No portal registered" };
        }

        console.log('Executing plan:', plan);

        try {
            for (const step of plan.steps) {
                const actionFn = this._spec.actions[step.name];
                if (actionFn) {
                    console.log(`Executing portal action: ${step.name}`, step.args);
                    await actionFn(step.args);
                } else {
                    console.warn(`Action ${step.name} not found in portal spec.`);
                    throw new Error(`Action ${step.name} not found`);
                }
            }
            return { status: "ok" };
        } catch (error: any) {
            console.error('Error executing plan:', error);
            return { status: "error", details: error.message || error };
        }
    }

    public get specs(): PortalSpec | null {
        return this._spec;
    }
}

export const chatPortalService = ChatPortalService.getInstance();

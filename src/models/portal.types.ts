export interface NavNode {
    id: string;
    description: string;
    // Potentially other metadata for the agent to understand the screen/state
}

export interface NavGraph {
    nodes: NavNode[];
    edges: { from: string; to: string; label?: string }[];
}

export interface NavAction {
    name: string;
    args?: any;
}

export interface NavPlan {
    steps: NavAction[];
    rationale?: string;
}

export interface PortalSpec {
    graph: NavGraph;
    actions: Record<string, (args: any) => Promise<any>>;
    state?: {
        get: () => Promise<{ route: string; pageId?: string; selection?: any }>;
    };
}

export interface ChatPortalAPI {
    registerPortal(spec: PortalSpec): void;
    executePlan(plan: NavPlan): Promise<{ status: "ok" | "error"; details?: any }>;
}

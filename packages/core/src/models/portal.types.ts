/**
 * Represents the configuration and context of the host application.
 * This information is used by the AI agent to understand the environment
 * it is operating in.
 */
export interface AppContext {
    /** Version of the AppContext schema */
    v: "1.1";

    /** Information about the website or application */
    site: {
        /** Name of the application (e.g., "Dali CRM") */
        name: string;
        /** Optional description of the site's purpose */
        description?: string;
        /** Deployment environment (e.g., "prod", "staging", "localhost") */
        deployment?: string;
        /** The base URL where the application is hosted */
        baseUrl?: string;
        /** The locale of the application (e.g., "en-US", "es-ES") */
        locale?: string;
    };

    /** Optional information about the currently logged-in user */
    user?: {
        /** Unique identifier for the user */
        id?: string;
        /** Human-readable name of the user */
        displayName?: string;
    };

    /** Navigation and interactive elements definition */
    nav?: {
        /** List of available routes/pages in the application */
        routes: AppRoute[];
        /** Clickable targets that are available globally (e.g., in a sidebar or header) */
        globalClickTargets?: ClickTarget[];
    };
}

/**
 * Defines a page or route within the application.
 */
export interface AppRoute {
    /** Unique identifier for the route (e.g., "leads.list") */
    id?: string;
    /** The URL path for this route (e.g., "/leads") */
    path: string;
    /** Human-readable title of the page */
    title: string;
    /** Detailed description of what this page does, used by the agent for context */
    description?: string;

    /** Alternative names or terms a user might use to refer to this page */
    keywords?: string[];

    /** Keywords representing main UI components present on this page */
    uiComponents?: string[];

    /** Logical sections within the page (e.g., tabs or vertical sections) */
    subSections?: Array<{
        /** Unique ID for the subsection */
        id: string;
        /** Display name of the subsection */
        name: string;
        /** Description of what is contained in this subsection */
        description?: string;
    }>;

    /** Interactive elements specific to this page */
    clickTargets?: ClickTarget[];
}

/**
 * Defines a clickable or interactive element in the UI.
 */
export interface ClickTarget {
    /** 
     * Stable unique identifier for the element. 
     * Recommended for robust automation (e.g., "btn.saveLead").
     */
    id?: string;
    /** 
     * Canonical name of the element. 
     * This is how the agent identifies the action conceptually.
     */
    name: string;
    /** Visible text in the UI (e.g., "Save Changes") */
    label?: string;
    /** Purpose of the element, helps the agent decide when to use it */
    description?: string;

    /** Type of element */
    kind?: "button" | "link";
    /** Alternative terms used to identify this action */
    keywords?: string[];

    /** Information used to locate the element in the DOM */
    locator?: {
        /** data-testid attribute value */
        testId?: string;
        /** CSS selector for the element */
        selector?: string;
        /** For links, the destination URL */
        href?: string;
    };

    /** The action that should be performed when this target is activated */
    action: ClickAction;
}

/**
 * Union type representing the possible actions triggered by a ClickTarget.
 */
export type ClickAction =
    | {
        /** Navigates to a different page */
        type: "navigate";
        /** ID of the target route */
        toRouteId?: string;
        /** Fallback path if route ID is not provided */
        toPath?: string;
    }
    | {
        /** Opens a modal, drawer, or panel */
        type: "open";
        /** Identifier for the target UI component to open */
        targetId: string;
    }
    | {
        /** Triggers a custom event or callback in the host application */
        type: "trigger";
        /** Custom string to identify the trigger in the application logic */
        trigger: string;
    }
    | {
        /** Generic action type for extension */
        type: string;
        [k: string]: unknown;
    };


/**
 * Result of executing a navigation or interaction plan.
 */
export interface ExecutePlanResult {
    /** Status of the execution */
    status: "ok" | "error";
    /** Optional details about the execution or error message */
    details?: unknown;
}


/**
 * Core interface for the Chat Portal API.
 */
export interface ChatPortalAPI {
    /**
     * Registers the host application's static context.
     * @param context The application definition (routes, site info, etc.)
     * @param handlers Optional handlers for executing plans (e.g. navigation)
     */
    registerPortal(context: AppContext, handlers?: { executePlan?: (plan: any) => Promise<ExecutePlanResult> }): void;
    /**
     * Executes a proposed plan of actions (navigation, clicks).
     * @param plan The plan object generated by the agent.
     */
    executePlan(plan: any): Promise<ExecutePlanResult>;
}




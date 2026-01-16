export interface AppContext {
    v: "1.1";

    site: {
        name: string;
        baseUrl?: string;
        locale?: string;
    };

    user?: {
        id?: string;
        displayName?: string;
    };

    nav?: {
        routes: Array<{
            id: string;                 // "clients.list"
            path: string;               // "/clients"
            title: string;              // "Clientes"
            keywords?: string[];

            // Qué cosas se pueden "clicar" en ESTA pantalla para navegar o abrir algo
            clickTargets?: ClickTarget[];
        }>;

        // Elementos globales (header/nav/sidebar) disponibles casi siempre
        globalClickTargets?: ClickTarget[];
    };
}

export type ClickTarget =
    | {
        id: string;                 // "btn.createClient"
        kind: "button" | "link";
        label: string;              // texto visible: "Crear cliente"
        keywords?: string[];        // cómo lo pediría un humano
        // cómo identificarlo en tu front
        selector?: string;          // css selector (si lo tienes)
        testId?: string;            // data-testid / automation id
        href?: string;              // si es link
        // qué produce el click (de cara al agente)
        action: {
            type: "navigate";
            toRouteId?: string;       // recomendado
            toPath?: string;          // fallback
        };
    }
    | {
        id: string;
        kind: "button" | "link";
        label: string;
        keywords?: string[];
        selector?: string;
        testId?: string;
        action: {
            type: "open";             // modal/drawer/panel (sin “tools”)
            targetId: string;         // "filtersPanel" / "helpModal"
        };
    };

export interface ChatPortalAPI {
    registerPortal(context: AppContext): void;
    // Keeping executePlan for now as it's used in services, but it might need rethink
    executePlan(plan: any): Promise<{ status: "ok" | "error"; details?: any }>;
}


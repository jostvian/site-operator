export type StoreItemType =
    | "thread"
    | "message"
    | "toolCall"
    | "workflow"
    | "task"
    | "attachment"
    | "sdkHiddenContext";

const ID_PREFIXES: Record<StoreItemType, string> = {
    "thread": "thr",
    "message": "msg",
    "toolCall": "tc",
    "workflow": "wf",
    "task": "tsk",
    "attachment": "atc",
    "sdkHiddenContext": "shcx",
};

export function generateId(itemType: StoreItemType): string {
    const prefix = ID_PREFIXES[itemType];
    // python uuid4().hex[:8] equivalent: remove dashes from uuid and take first 8 chars
    const randomPart = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
    return `${prefix}_${randomPart}`;
}

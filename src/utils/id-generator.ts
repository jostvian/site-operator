export type StoreItemType =
    | "thread"
    | "message"
    | "tool_call"
    | "workflow"
    | "task"
    | "attachment"
    | "sdk_hidden_context";

const ID_PREFIXES: Record<StoreItemType, string> = {
    "thread": "thr",
    "message": "msg",
    "tool_call": "tc",
    "workflow": "wf",
    "task": "tsk",
    "attachment": "atc",
    "sdk_hidden_context": "shcx",
};

export function generateId(itemType: StoreItemType): string {
    const prefix = ID_PREFIXES[itemType];
    // python uuid4().hex[:8] equivalent: remove dashes from uuid and take first 8 chars
    const randomPart = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
    return `${prefix}_${randomPart}`;
}

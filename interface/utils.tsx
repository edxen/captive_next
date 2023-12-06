export interface Voucher {
    uuid: number;
    code: number;
    plan_uuid: number;
}

export interface Credentials {
    room_number?: number;
    last_name: string;
}

type TypeTypes = 'guest_only' | 'code' | 'plan';
type ActionTypes = 'signin' | 'get_plans' | 'connect';

export interface Body {
    action: ActionTypes;
    type?: TypeTypes;
    code?: number;
    credentials?: Credentials;
    uuid?: number;
};

type MethodTypes = 'GET' | 'POST';

export interface FetchAPI {
    target: 'handler';
    method: MethodTypes;
    body?: Body;
}

export interface RequestInfo {
    method: MethodTypes;
    headers?: { 'Content-Type': string; },
    body?: string;
}

type StringObject = Record<string, string>;

interface PlanTranslations {
    [key: string]: string | StringObject;
    bandwidth: StringObject;
};

interface ConnectedTranslations {
    [key: string]: string | StringObject | PlanTranslations;
    guest: StringObject;
    plan: PlanTranslations;
};

interface Translations {
    authentication: StringObject;
    access_code: StringObject;
    plan_select: StringObject;
    connected: ConnectedTranslations;
    general: StringObject;
    layout: StringObject;
    error: StringObject;
}
export interface Texts {
    languages: StringObject;
    translations: {
        [key: string]: Translations;
    };
}
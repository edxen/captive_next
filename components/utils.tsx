import Translations from "./translation.json";

export interface Voucher {
    uuid: number;
    code: number;
    plan_uuid: number;
}

export interface Credentials {
    room_number?: number;
    last_name: string;
}

type TypeTypes = 'guest' | 'code' | 'credentials' | 'plan' | 'all';
type ActionTypes = 'signin' | 'connect';

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

interface RequestInfo {
    method: MethodTypes;
    headers?: { 'Content-Type': string; },
    body?: string;
}

export const fetchAPI = async ({ target, method, body }: FetchAPI) => {
    const requestInfo: RequestInfo = { method };
    if (body) {
        requestInfo.headers = { "Content-Type": "application/json" };
        requestInfo.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`../api/${target}`, { ...requestInfo });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Error fetching data');
        }
    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
};

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
interface Texts {
    languages: StringObject;
    translations: {
        [key: string]: Translations;
    };
}

export const getCurrentTranslation = () => {
    const jsonData: Texts = Translations;
    const currentLanguage = 'en';
    return jsonData.translations[currentLanguage];
}


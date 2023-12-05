import { Data, StringKey } from "./inteface";
import Translations from "./translation.json";

type ActionTypes = 'guest' | 'plan' | 'signin' | 'plans' | 'signout' | 'connect' | 'disconnect';

export interface FetchAPI {
    target: 'handler' | 'readFirebaseFile';
    method: 'GET' | 'POST';
    body?: {
        action: ActionTypes;
        type?: 'guest' | 'code' | 'credentials' | 'plan';
        code?: string;
        credentials?: {
            room_number: string;
            last_name: string;
        },
        guestuuid?: string;
        plan?: string;
    };
}

interface RequestInfo {
    method: 'GET' | 'POST',
    headers?: {
        'Content-Type': string;
    },
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
    connected: ConnectedTranslations;
    general: StringObject;
    layout: StringObject;
    error: StringObject;
}
interface Texts {
    languages: StringKey;
    translations: {
        [key: string]: Translations;
    };
}

export const getCurrentTranslation = () => {
    const jsonData: Texts = Translations;
    const currentLanguage = 'en';
    return jsonData.translations[currentLanguage];
}


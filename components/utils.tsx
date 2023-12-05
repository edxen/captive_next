import { Data, StringKey } from "./inteface";
import Translations from "./translation.json";

type ActionTypes = 'signin' | 'billplans' | 'signout' | 'connect' | 'disconnect';

export interface FetchAPI {
    target: 'handler' | 'readFirebaseFile';
    method: 'GET' | 'POST';
    body?: {
        action: ActionTypes;
        type?: 'guest' | 'access_code' | 'credentials' | 'bill_plan';
        access_code?: string;
        credentials?: {
            room_number: string;
            last_name: string;
        },
        bill_plan?: string;
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
        console.log(response);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Error fetching data');
        }
    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
};

interface Translations {
    access_code: StringKey;
    credentials: StringKey;
    buttons: StringKey;
    guest: StringKey;
    connected: StringKey,
    bill_plan: {
        [key: string]: string | {};
        bandwidth: StringKey;
    };
    error: StringKey;
}

interface Texts {
    languages: StringKey;
    translations: {
        en: Translations;
    };
}

export const getCurrentTranslation = () => {
    const jsonData: Texts = Translations;
    const currentLanguage = 'en';
    return jsonData.translations[currentLanguage];
}


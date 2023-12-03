import { Data, Texts } from "./inteface";
import Translations from "./translation.json";

type ActionTypes = 'signin' | 'signout' | 'connect' | 'disconnect';

export interface FetchAPI {
    target: 'handler';
    method: 'GET' | 'POST';
    body?: {
        action: ActionTypes;
        type?: 'access_code' | 'credentials' | 'bill_plan';
        access_code?: string;
        credentials?: {
            room_number: string;
            last_name: string;
        },
        bill_plan?: string;
    };
}

export const fetchAPI = async ({ target, method, body }: FetchAPI) => {
    const headers: { 'Content-Type': string; } = { "Content-Type": "application/json" };
    const bodyString: string = JSON.stringify(body);

    try {
        const response = await fetch(`../api/${target}`, { method, headers, body: bodyString });
        if (response.ok) {
            return await response.json() as Data;
        } else {
            throw new Error('Error fetching data');
        }
    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
};

export const getCurrentTranslation = () => {
    const jsonData: Texts = Translations;
    const currentLanguage = 'en';
    return jsonData.translations[currentLanguage];
}

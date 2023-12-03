import { Data } from "./inteface";

type ActionTypes = 'signin' | 'signout' | 'connect' | 'disconnect';

export interface FetchAPI {
    target: 'handler';
    method: 'GET' | 'POST';
    body?: {
        action: ActionTypes;
        type?: 'access_code' | 'credentials';
        access_code?: string;
        credentials?: {
            room_number: string;
            last_name: string;
        };
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


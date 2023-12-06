import { FetchAPI, RequestInfo, Texts } from "@/interface/utils";
import Translations from "./translation.json";

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

export const getCurrentTranslation = () => {
    const jsonData: Texts = Translations;
    const currentLanguage = 'en';
    return jsonData.translations[currentLanguage];
}


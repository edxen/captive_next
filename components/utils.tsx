import Head from "next/head";
import { FetchAPI, HeadMetaType, MetaDataType, RequestInfo, Texts } from "@/interface/utils";
import Translations from "./translation.json";
import Metadata from './metadata.json';

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
};

export const HeadMeta: React.FC<HeadMetaType> = ({ page }) => {
    const header: MetaDataType = Metadata;
    return (
        <Head>
            <title>{header[page].title}</title>
            <meta name="description" content={header[page].description} />
            <meta name="keywords" content={header[page].keywords} />
            <meta name="robots" content={header[page].noindex} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
    );
};
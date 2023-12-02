import { useState } from 'react';
import Layout from "../components/layout";
import Link from 'next/link';
import InputGroup from "../components/inputGroup";
import Translations from '../components/translation.json';
import { Texts } from '../components/inteface';
import { fetchAPI } from '../components/fetchAPI';

const jsonData: Texts = Translations;
const currentLanguage = 'en';
const texts = jsonData.translations[currentLanguage];

const AccessCode = () => {
    const [accessCode, setAccessCode] = useState<{ [key: string]: string; }>({ access_code: "" });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleConnect = async () => {
        const { access_code } = accessCode;
        if (access_code === "") {
            setErrorMessage(texts.error.blank_access_code);
        } else {
            const body = { action: "connect", type: "access_code", access_code };
            await fetchAPI({ target: "handler", method: "POST", body });
        }
    };

    return (
        <Layout>
            <h2>This is Access Code</h2>
            <div>
                <InputGroup value={accessCode.access_code} label={texts.access_code.label} htmlFor='access_code' updateData={setAccessCode} />
                <div>{errorMessage}</div>
                <button onClick={handleConnect}>{texts.access_code.connect}</button>
            </div>

            <Link href="/templates/authentication">
                <button>Guest Login</button>
            </Link>
        </Layout>
    );
};

export default AccessCode;
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from "../components/layout";
import { Data, Texts } from '../components/inteface';
import { fetchAPI, FetchAPI, getCurrentTranslation } from '../components/utils';

const texts = getCurrentTranslation();

const AccessCode = () => {
    const [inputAccessCode, setInputAccessCode] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputAccessCode(e.target.value);
    };

    const handleConnect = async () => {
        if (inputAccessCode === "") {
            setErrorMessage(texts.error.blank_access_code);
        } else {
            const body: FetchAPI['body'] = { action: "connect", type: "access_code", access_code: inputAccessCode };
            const data = await fetchAPI({ target: "handler", method: "POST", body }) as Data;
            if (data.success) {
                router.push('./connected');
            } else {
                setErrorMessage(texts.error.invalid_access_code);
            }
        }
    };

    return (
        <Layout>
            <h2>This is Access Code</h2>
            <div>
                <label>{texts.access_code.label}</label>
                <input onChange={handleChange} value={inputAccessCode} placeholder={texts.access_code.placeholder}></input>
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
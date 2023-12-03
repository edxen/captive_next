import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Credentials } from "../components/inteface";
import { fetchAPI, getCurrentTranslation } from "../components/utils";
import { Data } from '../components/inteface';

import Layout from "../components/layout";
import InputGroup from "../components/inputGroup";

const texts = getCurrentTranslation();

const Authentication = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [credentials, setCredentials] = useState<Credentials>({ room_number: '', last_name: '' });
    const updateCredentials = (value: Partial<Credentials>) => setCredentials((prevCredentials: Credentials) => ({ ...prevCredentials, ...value }));

    const router = useRouter();

    const handleClick = () => {
        setIsLoading(true);
    };

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage('');
        const emptyCredentials: boolean = Object.values(credentials).every(credential => credential === '');
        if (emptyCredentials) {
            setErrorMessage(texts.error.blank_credentials);
        } else {
            setIsLoading(true);
            const data = await fetchAPI({ target: "handler", method: "POST", body: { action: 'signin', credentials } }) as Data;
            if (data.success) {
                router.push('/templates/bill_plan');
            } else {
                setIsLoading(false);
                setErrorMessage(texts.error.invalid_credentials);
            }
        }
    };

    return (
        <>
            <Layout isLoading={isLoading}>
                <form onSubmit={handleSignIn}>
                    <h2>This is Authentication</h2>
                    <InputGroup value={credentials.room_number} label={texts.credentials.room_number} htmlFor='room_number' updateData={updateCredentials} />
                    <InputGroup value={credentials.last_name} label={texts.credentials.last_name} htmlFor='last_name' updateData={updateCredentials} />
                    <div>{errorMessage}</div>
                    <button>{texts.buttons.sign_in}</button>
                </form>
                <Link href="/templates/access_code">
                    <button onClick={handleClick}>{texts.buttons.login_access_code}</button>
                </Link>
            </Layout>
        </>
    );
};

export default Authentication;
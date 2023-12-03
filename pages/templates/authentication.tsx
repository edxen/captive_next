import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Site, Credentials } from "../components/inteface";
import { fetchAPI, getCurrentTranslation } from "../components/utils";
import { Data } from '../components/inteface';

import Layout from "../components/layout";
import InputGroup from "../components/inputGroup";

const texts = getCurrentTranslation();

const Authentication = () => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [site, setSite] = useState<Site | null>(null);
    const [credentials, setCredentials] = useState<Credentials>({ room_number: '', last_name: '' });
    const updateCredentials = (value: Partial<Credentials>) => setCredentials((prevCredentials: Credentials) => ({ ...prevCredentials, ...value }));

    const router = useRouter();

    useEffect(() => {
        const fetchSite = async () => {
            const data = await fetchAPI({ target: "handler", method: 'POST' });
            if (data) {
                setSite(data.site);
            }
        };
        fetchSite();
    }, [site?.signed_in]);

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage('');

        const emptyCredentials: boolean = Object.values(credentials).every(credential => credential === '');
        if (emptyCredentials) {
            setErrorMessage(texts.error.blank_credentials);
        } else {
            const data = await fetchAPI({ target: "handler", method: "POST", body: { action: 'signin', credentials } }) as Data;
            if (data.success) {
                router.push('./bill_plan');
            } else {
                setErrorMessage(texts.error.invalid_credentials);
            }
        }
    };

    return (
        <>
            <Layout>
                <form onSubmit={handleSignIn}>
                    <h2>This is Authentication</h2>
                    <InputGroup value={credentials.room_number} label={texts.credentials.room_number} htmlFor='room_number' updateData={updateCredentials} />
                    <InputGroup value={credentials.last_name} label={texts.credentials.last_name} htmlFor='last_name' updateData={updateCredentials} />
                    <div>{errorMessage}</div>
                    <button>{texts.credentials.sign_in}</button>
                </form>
                <Link href="/templates/access_code">
                    <button>Connect with Access Code</button>
                </Link>
            </Layout>
        </>
    );
};

export default Authentication;
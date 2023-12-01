import Layout from "../components/layout";
import Translations from '../components/translation.json';
import { ChangeEvent, useState } from 'react';

type StringKey = {
    [key: string]: string;
};

interface Translations {
    credentials: StringKey;
    error: StringKey;
}

interface Texts {
    languages: StringKey;
    translations: {
        en: Translations;
    };
}

const jsonData: Texts = Translations;
const currentLanguage = 'en';
const texts = jsonData.translations[currentLanguage];

interface Credentials {
    room_number: number | undefined;
    last_name: string;
}

const Authentication = () => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [credentials, setCredentials] = useState<Credentials>({
        room_number: undefined,
        last_name: ''
    });
    const updateCredentials = (value: Partial<Credentials>) => setCredentials((prevCredentials: Credentials) => ({ ...prevCredentials, ...value }));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage('');
        if (credentials.room_number === undefined || credentials.last_name === '') {
            setErrorMessage(texts.error.blank_credentials);
        } else {
            try {
                const response = await fetch('../api/pms', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });
                if (response.ok) {
                    const data = await response.json();
                    if (!data.success) setErrorMessage(texts.error.invalid_credentials);
                } else {
                    throw new Error('error fetching data');
                }
            } catch (error) {
                console.error(`there was an error: ${error}`);
            }
        }
    };

    return (
        <>
            <Layout>
                <form onSubmit={handleSubmit}>
                    <h2>This is Authentication</h2>
                    <InputGroup label={texts.credentials.room_number} htmlFor='room_number' updateCredentials={updateCredentials} />
                    <InputGroup label={texts.credentials.last_name} htmlFor='last_name' updateCredentials={updateCredentials} />
                    <div>{errorMessage}</div>
                    <button>{texts.credentials.sign_in}</button>
                </form>
            </Layout>
        </>
    );
};

export default Authentication;

interface InputGroupProps {
    label: string;
    htmlFor: any;
    updateCredentials: (value: Partial<Credentials>) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, htmlFor, updateCredentials }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const partialUpdate: Partial<Credentials> = {
            [htmlFor]: e.target.value
        };
        updateCredentials(partialUpdate);
    };

    return (
        <div>
            <label htmlFor={htmlFor}>{label}</label>
            <input onChange={handleChange} />
        </div>
    );
};
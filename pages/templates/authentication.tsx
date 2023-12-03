import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';

import { Site, Texts, Credentials, BillPlan } from "../components/inteface";
import { fetchAPI, FetchAPI } from "../components/fetchAPI";
import { Data } from '../components/inteface';

import Layout from "../components/layout";
import InputGroup from "../components/inputGroup";
import Translations from '../components/translation.json';

import Link from 'next/link';

const jsonData: Texts = Translations;
const currentLanguage = 'en';
const texts = jsonData.translations[currentLanguage];

const Authentication = () => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [site, setSite] = useState<Site | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
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

    const handleSignOut = async () => {
        await fetchAPI({ target: "handler", method: "POST", body: { action: 'signout' } });

        setSelectedPlan("");
        setCredentials({ room_number: "", last_name: "" });
    };

    const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedPlan(event.target.value.replace('plan_', ''));
    };

    const handleConnect = async () => {
        if (selectedPlan === "") {
            setErrorMessage(texts.error.no_plan_selected);
        } else {
            const body: FetchAPI['body'] = { action: "connect", type: "bill_plan", bill_plan: selectedPlan };
            const data = await fetchAPI({ target: "handler", method: "POST", body }) as Data;
            if (data.success) {
                router.push('./connected');
            }

        }
    };

    const billPlans = site ? site.bill_plans as [BillPlan] : null;

    return (
        <>
            <Layout>
                {!site?.signed_in.status
                    ? (
                        <form onSubmit={handleSignIn}>
                            <h2>This is Authentication</h2>
                            <InputGroup value={credentials.room_number} label={texts.credentials.room_number} htmlFor='room_number' updateData={updateCredentials} />
                            <InputGroup value={credentials.last_name} label={texts.credentials.last_name} htmlFor='last_name' updateData={updateCredentials} />
                            <div>{errorMessage}</div>
                            <button>{texts.credentials.sign_in}</button>
                        </form>
                    )
                    : (
                        <div>
                            <h2>You are now signed in</h2>
                            {billPlans?.map((plan) =>
                                <li key={plan.uuid}>
                                    <label>
                                        <input type="radio" value={`plan_${plan.uuid}`} name="bill_plans" onChange={handleSelect}></input>
                                        {plan.name} {plan.amount} $
                                    </label>
                                </li>
                            )}
                            <div>{errorMessage}</div>
                            <button onClick={handleSignOut}>{texts.credentials.sign_out}</button>
                            <button onClick={handleConnect}>{texts.credentials.connect}</button>
                        </div>
                    )
                }
                <Link href="/templates/access_code">
                    <button>Connect with Access Code</button>
                </Link>
            </Layout>
        </>
    );
};

export default Authentication;
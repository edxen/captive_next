import { useState, useEffect, ChangeEvent } from 'react';
import { Site, Texts, Credentials, BillPlan } from "../components/inteface";
import { fetchAPI } from "../components/fetchAPI";

import Layout from "../components/layout";
import InputGroup from "../components/inputGroup";
import Translations from '../components/translation.json';

const jsonData: Texts = Translations;
const currentLanguage = 'en';
const texts = jsonData.translations[currentLanguage];

const Authentication = () => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [site, setSite] = useState<Site | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [credentials, setCredentials] = useState<Credentials>({ room_number: '', last_name: '' });
    const updateCredentials = (value: Partial<Credentials>) => setCredentials((prevCredentials: Credentials) => ({ ...prevCredentials, ...value }));

    const fetchSite = async ({ method, body }: { method: string, body?: { [key: string]: string; }; }) => {
        const data = await fetchAPI({ target: "handler", method, body });
        if (data) setSite(data.site);
    };

    useEffect(() => {
        fetchSite({ method: "GET" });
    }, [site?.signed_in]);

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage('');
        if (credentials.room_number === undefined || credentials.last_name === '') {
            setErrorMessage(texts.error.blank_credentials);
        } else {
            const body = {
                action: "signin",
                room_number: String(credentials.room_number),
                last_name: credentials.last_name
            };
            const data = await fetchAPI({ target: "handler", method: "POST", body });
            if (!data.success) setErrorMessage(texts.error.invalid_credentials);
        }
    };

    const handleSignOut = async () => {
        const body = { action: "signout" };
        await fetchAPI({ target: "handler", method: "POST", body });

        setSelectedPlan("");
        setCredentials({ room_number: "", last_name: "" });
    };

    const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedPlan(event.target.id.replace('plan_', ''));
    };

    const handleConnect = async () => {
        if (selectedPlan === "") {
            setErrorMessage(texts.error.no_plan_selected);
        } else {
            const body = { action: "connect", plan_uuid: selectedPlan };
            await fetchAPI({ target: "handler", method: "POST", body });
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
                            <InputGroup value={credentials.room_number} label={texts.credentials.room_number} htmlFor='room_number' updateCredentials={updateCredentials} />
                            <InputGroup value={credentials.last_name} label={texts.credentials.last_name} htmlFor='last_name' updateCredentials={updateCredentials} />
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
                                        <input type="radio" id={`plan_${plan.uuid}`} name="bill_plans" onChange={handleSelect}></input>
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
            </Layout>
        </>
    );
};

export default Authentication;
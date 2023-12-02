import Layout from "../components/layout";
import Translations from '../components/translation.json';
import { useState, useEffect, ChangeEvent } from 'react';
import InputGroup from "../components/inputGroup";
import { Site, Texts, Credentials, BillPlan } from "../components/inteface";
import { fetchAPI } from "../components/fetchAPI";

const jsonData: Texts = Translations;
const currentLanguage = 'en';
const texts = jsonData.translations[currentLanguage];

const Authentication = () => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [credentials, setCredentials] = useState<Credentials>({
        room_number: undefined,
        last_name: ''
    });
    const updateCredentials = (value: Partial<Credentials>) => setCredentials((prevCredentials: Credentials) => ({ ...prevCredentials, ...value }));

    const fetchPMS = async () => {
        const params = {
            target: "handler",
            method: "POST",
            body: {
                action: "signin",
                room_number: String(credentials.room_number),
                last_name: credentials.last_name
            }
        };
        return await fetchAPI({ ...params });
    };

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage('');
        if (credentials.room_number === undefined || credentials.last_name === '') {
            setErrorMessage(texts.error.blank_credentials);
        } else {
            const data = await fetchPMS();
            if (!data.success) setErrorMessage(texts.error.invalid_credentials);
        }
    };

    const [site, setSite] = useState<Site | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string>("");

    const fetchSite = async ({ method, body }: { method: string, body?: { [key: string]: string; }; }) => {
        const data = await fetchAPI({ target: "handler", method, body });
        if (data) setSite(data.site);
    };
    const handleSignOut = async () => {
        const params = {
            target: "handler",
            method: "POST",
            body: {
                action: "signout",
            }
        };
        await fetchAPI({ ...params });

        setSelectedPlan("");
        setCredentials({
            room_number: undefined,
            last_name: ''
        });
    };

    useEffect(() => {
        fetchSite({ method: "GET" });
    }, [site?.signed_in]);

    // const guest = site ? site.signed_in.guest as Guest : null;
    const billPlans = site ? site.bill_plans as [BillPlan] : null;

    const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedPlan(event.target.id.replace('plan_', ''));
    };

    const handleConnect = async () => {
        if (selectedPlan === "") {
            setErrorMessage(texts.error.no_plan_selected);
        } else {
            const params = {
                target: "handler",
                method: "POST",
                body: {
                    action: "connect",
                    plan_uuid: selectedPlan
                }
            };
            await fetchAPI({ ...params });
        }
    };

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
                                        <input type="radio" id={`plan_${plan.uuid}`} name="bill_plans" onClick={handleSelect}></input>
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
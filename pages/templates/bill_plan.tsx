import Layout from "../components/layout";
import { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from "next/router";

import { fetchAPI, FetchAPI, getCurrentTranslation } from "../components/utils";
import { Site, Data } from "../components/inteface";

const texts = getCurrentTranslation();

const BillPlan = () => {
    const [site, setSite] = useState<Site | null>(null);
    const [plan, setPlan] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const router = useRouter();

    const handleSignOut = async () => {
        const data = await fetchAPI({ target: "handler", method: "POST", body: { action: 'signout' } }) as Data;
        if (data.success) {
            router.push('/templates/authentication');
        }
    };

    const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
        setPlan(event.target.value.replace('plan_', ''));
    };

    const handleConnect = async () => {
        if (plan === "") {
            setErrorMessage(texts.error.no_plan_selected);
        } else {
            const body: FetchAPI['body'] = { action: "connect", type: "bill_plan", bill_plan: plan };
            const data = await fetchAPI({ target: "handler", method: "POST", body }) as Data;
            if (data.success) {
                router.push('./connected');
            }
        }
    };

    useEffect(() => {
        const fetchSite = async () => {
            const data = await fetchAPI({ target: "handler", method: 'GET' });
            if (data) {
                setSite(data.site);
            }
        };
        fetchSite();
    }, [site?.signed_in]);

    const billPlans = (site?.bill_plans) && site.bill_plans;

    return (
        <Layout>
            <h2>This is Bill plan page</h2>

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
        </Layout>
    );
};

export default BillPlan;
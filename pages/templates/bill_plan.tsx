import Layout from "../../components/layout";
import { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from "next/router";

import { fetchAPI, FetchAPI, getCurrentTranslation } from "../../components/utils";
import { Site, Data, Guest } from "../../components/inteface";
import { StyledHeader, StyledInstructions, StyledRadioGroup, StyledButton, StyledDivider, StyledError, StyledSelectGroup } from "../../styled/authentication";

const texts = getCurrentTranslation();

const BillPlan = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [site, setSite] = useState<Site | null>(null);
    const [plan, setPlan] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const router = useRouter();

    const handleSignOut = async () => {
        setIsLoading(true);
        const data = await fetchAPI({ target: "handler", method: "POST", body: { action: 'signout' } }) as Data;
        if (data.success) {
            router.push('/templates/authentication');
        }
    };

    const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
        setPlan(event.target.value.replace('plan_', ''));
    };

    const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (plan === "") {
            setErrorMessage(texts.error.no_plan_selected);
        } else {
            setIsLoading(true);
            const body: FetchAPI['body'] = { action: "connect", type: "bill_plan", bill_plan: plan };
            const data = await fetchAPI({ target: "handler", method: "POST", body }) as Data;
            if (data.success) {
                router.push('/templates/connected');
            } else {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const fetchSite = async () => {
            const data = await fetchAPI({ target: "handler", method: 'GET' });
            if (data) {
                setIsLoading(false);
                setSite(data.site);
                setPlan(data.site.bill_plans[0].uuid);
            }
        };
        fetchSite();
    }, []);

    const billPlans = (site?.bill_plans) && site.bill_plans;
    const signed_in = (site?.signed_in) && site.signed_in;
    const guest: Partial<Guest> | undefined = (signed_in) && signed_in.guest;

    return (
        <Layout isLoading={isLoading}>
            <StyledHeader>
                Welcome! {guest && guest.first_name}.
            </StyledHeader>
            <StyledInstructions>
                Please select a plan to continue:
            </StyledInstructions>
            <form onSubmit={handleConnect}>
                <StyledRadioGroup>
                    {billPlans?.map((plan, index) =>
                        <li key={plan.uuid}>
                            <label>
                                <input type="radio" value={`plan_${plan.uuid}`} name="bill_plans" onChange={handleSelect} defaultChecked={(index === 0) ? true : false}></input>
                                <span>{plan.name} {plan.duration} minutes {plan.amount !== 0 && (`${plan.amount}$`)}</span>
                            </label>
                        </li>
                    )}
                </StyledRadioGroup>
                {
                    plan && billPlans?.filter((billplan) => billplan.uuid === plan)[0].amount !== 0 && (
                        <StyledSelectGroup>
                            <label>
                                Payment Method:
                            </label>
                            <select>
                                <option defaultChecked={true}>
                                    Charge to Room
                                </option>
                            </select>
                        </StyledSelectGroup>
                    )
                }
                <StyledError>{errorMessage}</StyledError>
                <StyledButton>{texts.buttons.connect}</StyledButton>
            </form>
            <StyledDivider>
                Or
            </StyledDivider>
            <StyledButton onClick={handleSignOut}>{texts.buttons.sign_out}</StyledButton>
        </Layout >
    );
};

export default BillPlan;
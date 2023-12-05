import Layout from "../../components/layout";
import { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from "next/router";

import { fetchAPI, FetchAPI, getCurrentTranslation } from "../../components/utils";
import { Data, Guest, BillPlan } from "../../components/inteface";
import { StyledHeader, StyledInstructions, StyledRadioGroup, StyledButton, StyledDivider, StyledError, StyledSelectGroup } from "../../styled/authentication";

const texts = getCurrentTranslation();

const Billplan = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedPlan, setSelectedPlan] = useState<Partial<BillPlan>>({});
    const [plans, setPlans] = useState<BillPlan[]>([]);
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
        const uuid = event.target.value.replace('plan_', '');
        const found = plans.filter((plan) => plan.uuid === uuid)[0];
        if (found) {
            setSelectedPlan(found);
        }
    };

    const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedPlan.uuid === "") {
            setErrorMessage(texts.error.no_plan_selected);
        } else {
            setIsLoading(true);
            const body: FetchAPI['body'] = { action: "connect", type: "bill_plan", bill_plan: selectedPlan.uuid };
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
            const data = await fetchAPI({ target: "readFirebaseFile", method: 'POST', body: { action: 'billplans', type: 'guest' } });
            if (data.billplans?.length) {
                setIsLoading(false);
                setSelectedPlan(data.billplans[0]);
                setPlans(data.billplans);
            } else {
                setIsLoading(false);
                setErrorMessage('No Bill Plans Available');
            }
        };
        fetchSite();
    }, []);

    return (
        <Layout isLoading={isLoading}>
            <StyledHeader>
                Welcome!
            </StyledHeader>
            <StyledInstructions>
                Please select a plan to continue:
            </StyledInstructions>
            <form onSubmit={handleConnect}>
                <StyledRadioGroup>
                    {plans.map((plan, index) =>
                        <li key={plan.uuid}>
                            <label>
                                <input type="radio" value={`plan_${plan.uuid}`} name="bill_plans" onChange={handleSelect} defaultChecked={(index === 0) ? true : false}></input>
                                <span>{plan.name} {plan.duration} minutes {plan.amount !== 0 && (`${plan.amount}$`)}</span>
                            </label>
                        </li>
                    )}
                </StyledRadioGroup>
                {
                    selectedPlan.amount !== 0 && (
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

export default Billplan;
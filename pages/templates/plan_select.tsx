import { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from "next/router";

import { fetchAPI, FetchAPI, getCurrentTranslation } from "@/components/utils";
import { StyledTitle, StyledInstructions, StyledRadioGroup, StyledButton, StyledDivider, StyledError, StyledSelectGroup } from "@/styles/styled";
import { Plan, Site } from "@/components/inteface";
import Waiting from "./waiting";

const texts = getCurrentTranslation();

const Billplan = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedPlan, setSelectedPlan] = useState<Partial<Plan>>({});
    const [plans, setPlans] = useState<Plan[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const router = useRouter();

    const handleSignOut = async () => {
        const result = confirm('Are you sure?');
        if (result) {
            setIsLoading(true);
            router.push('/');
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
            const body: FetchAPI['body'] = { action: "connect", type: "plan", plan: selectedPlan.uuid };
            const data = await fetchAPI({ target: "handler", method: "POST", body });
            if (data.success) {
                const query = {
                    gid: site.signed_in?.guest?.uuid,
                    pid: data.plan.uuid
                };
                router.push(`/templates/connected?gid=${query.gid}&pid=${query.pid}`);
            } else {
                setIsLoading(false);
            }
        }
    };

    const [site, setSite] = useState<Site>({
        signed_in: {
            status: false
        }
    });

    useEffect(() => {
        const fetchSite = async () => {
            if (router.isReady) {
                const gid = router.query.gid as string;
                if (gid) {
                    const guestData = await fetchAPI({ target: "handler", method: 'POST', body: { action: 'guest', guestuuid: gid } });
                    setSite((prevSite) => ({ ...prevSite, signed_in: { status: true, guest: guestData.guest } }));

                    const data = await fetchAPI({ target: "handler", method: 'POST', body: { action: 'plans', type: 'guest' } });
                    if (data.plans?.length) {
                        setIsLoading(false);
                        setSelectedPlan(data.plans[0]);
                        setPlans(data.plans);
                    } else {
                        setIsLoading(false);
                        setErrorMessage('No Plans Available');
                    }
                } else {
                    router.push('/');
                }
            }
        };
        fetchSite();
    }, [router]);

    return (
        isLoading
            ? <Waiting />
            : <>
                <StyledTitle>
                    {texts.plan_select.title} {site.signed_in?.status && site.signed_in?.guest?.first_name}
                </StyledTitle>
                <StyledInstructions>
                    {texts.plan_select.instructions}
                </StyledInstructions>
                <form onSubmit={handleConnect}>
                    <StyledRadioGroup>
                        {plans.map((plan, index) =>
                            <li key={plan.uuid}>
                                <label>
                                    <input type="radio" value={`plan_${plan.uuid}`} name="plans" onChange={handleSelect} defaultChecked={(index === 0) ? true : false} />
                                    <div>
                                        <span>{plan.name} {plan.amount !== 0 && (`- ${texts.plan_select.currency}${plan.amount}`)}</span>
                                        <span>{plan.duration} minutes</span>
                                    </div>
                                </label>
                            </li>
                        )}
                    </StyledRadioGroup>
                    {
                        selectedPlan.amount !== 0 && (
                            <StyledSelectGroup>
                                <label>
                                    {texts.plan_select.payment_method}
                                </label>
                                <select>
                                    <option defaultChecked={true}>
                                        {texts.plan_select.charge_to_room}
                                    </option>
                                </select>
                            </StyledSelectGroup>
                        )
                    }
                    <StyledError>{errorMessage}</StyledError>
                    <StyledButton>{texts.general.connect}</StyledButton>
                </form>
                <StyledDivider>
                    {texts.general.or}
                </StyledDivider>
                <StyledButton onClick={handleSignOut}>{texts.general.sign_out}</StyledButton>
            </>
    );
};

export default Billplan;
import { ChangeEvent, useEffect, useContext } from 'react';
import { useRouter } from "next/router";

import { fetchAPI, FetchAPI, getCurrentTranslation } from "@/components/utils";
import { StyledTitle, StyledInstructions, StyledRadioGroup, StyledButton, StyledDivider, StyledError, StyledSelectGroup } from "@/styles/styled";
import { SiteContext } from '@/components/context';
import Waiting from "./waiting";

const texts = getCurrentTranslation();

const Billplan = () => {
    const { site, updateSite, updateStatus, removeSite } = useContext(SiteContext);

    const router = useRouter();

    const handleSignOut = async () => {
        const result = confirm(texts.general.confirm_question);
        if (result) {
            updateStatus({ signed_in: false, loading: true });
            removeSite({ guest: site.guest });
            router.push('/');
        }
    };

    const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const uuid = parseInt(event.target.value.replace('plan_', ''));
        const getPlan = site.plans.filter((plan) => plan.uuid === uuid)[0];
        if (getPlan) updateSite({ plan: getPlan });
    };

    const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!site.plan?.uuid) updateStatus({ error: texts.error.no_plan_selected });
        else {
            updateStatus({ loading: true });
            const body: FetchAPI['body'] = { action: "connect", type: "plan", uuid: site.plan?.uuid };
            const data = await fetchAPI({ target: "handler", method: "POST", body });
            if (data.success) {
                removeSite({ plans: site.plans });
                updateStatus({ error: '', connected: true });
                const redirectPath: string = '/templates/connected';
                router.push(redirectPath);
            } else {
                updateStatus({ loading: false });
            }
        }
    };

    useEffect(() => {
        const toggleLoading = async () => {
            if (router.isReady) {
                if (site.status.signed_in) {
                    const data = await fetchAPI({ target: "handler", method: 'POST', body: { action: 'get_plans', type: 'guest_only' } });
                    updateStatus({ loading: false });
                    if (data.plans?.length) {
                        updateSite({ plans: data.plans, plan: data.plans[0] });
                    } else {
                        updateStatus({ error: texts.error.no_plans_available });
                    }
                } else {
                    updateStatus({ loading: true });
                    router.push('/');
                }
            } else {
                updateStatus({ loading: true });
            }
        };
        toggleLoading();
        // eslint-disable-next-line
    }, [router]);

    return (
        site.status.loading
            ? <Waiting />
            : <>
                <StyledTitle>
                    {texts.plan_select.title} {site.status.signed_in && site.guest?.first_name}
                </StyledTitle>
                <StyledInstructions>
                    {texts.plan_select.instructions}
                </StyledInstructions>
                <form onSubmit={handleConnect}>
                    <StyledRadioGroup>
                        {site.plans.map((plan, index) =>
                            <li key={plan.uuid}>
                                <label>
                                    <input type="radio" value={`plan_${plan.uuid}`} name="plans" onChange={handleSelect} defaultChecked={(index === 0) ? true : false} />
                                    <div>
                                        <span>{plan.name} {plan.amount !== 0 && (`- ${texts.plan_select.currency}${plan.amount}`)}</span>
                                        <span>{plan.duration} {texts.plan_select.minutes}</span>
                                    </div>
                                </label>
                            </li>
                        )}
                    </StyledRadioGroup>
                    {
                        site.plan?.amount !== 0 && (
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
                    <StyledError>{site.status.error}</StyledError>
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
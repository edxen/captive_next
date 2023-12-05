import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { fetchAPI, getCurrentTranslation } from "@/components/utils";
import { StyledButton, StyledTitle, StyledInstructions, StyledList } from '@/styles/styled';
import { Site, Guest, Plan } from '@/components/inteface';
import Waiting from './waiting';

const texts = getCurrentTranslation();

const Connected = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [site, setSite] = useState<Site | null>(null);

    const router = useRouter();

    const handleClick = async () => {
        const result = confirm('Are you sure?');
        if (result) {
            setIsLoading(true);
            router.push('/');
        }
    };

    useEffect(() => {
        const fetchSite = async () => {
            if (router.isReady) {
                const queryData = router.query;
                if (queryData.gid || queryData.pid) {
                    const guestData = await fetchAPI({ target: "handler", method: 'POST', body: { action: 'guest', guestuuid: queryData.gid as string } });
                    const planData = await fetchAPI({ target: "handler", method: 'POST', body: { action: 'plan', plan: queryData.pid as string } });

                    if (guestData.success) {
                        setSite((prevSite) => ({ ...prevSite, signed_in: { status: true, guest: guestData.guest } }));
                    }
                    if (planData.success) {
                        if (queryData.aid) {
                            planData.plan.code = queryData.aid;
                            console.log(planData.plan);
                        }
                        setSite((prevSite) => ({ ...prevSite, connected: { status: true, plan: planData.plan } }));
                        setIsLoading(false);
                    }
                }
            }
        };
        fetchSite();
    }, [router]);

    const signed_in = (site?.signed_in) && site.signed_in;
    const guest: Partial<Guest> | undefined = (signed_in) && signed_in.guest;
    const connected = (site?.connected) && site.connected;
    const plan: Partial<Plan> | undefined = (connected) && connected?.plan;

    const interpolateText = (text: string, reference: string): string => {
        const replacedMessage: string = text.replace(/\{([^{}]+)\}/g, reference);
        return replacedMessage;
    };

    return (
        isLoading
            ? <Waiting />
            : <>
                <StyledTitle>
                    {guest && guest.uuid
                        ? <> {interpolateText(texts.connected.title_guest as string, guest?.first_name as string)}
                        </>
                        : <> {texts.connected.title}
                        </>
                    }
                </StyledTitle>
                <StyledInstructions>
                    {texts.connected.instructions as string}
                </StyledInstructions>

                {guest && guest.uuid && (
                    <>
                        <StyledInstructions>
                            {texts.connected.guest_title as string}
                        </StyledInstructions>
                        <StyledList>
                            <div>
                                <label>{texts.connected.guest.room_number}:</label>
                                <span>{guest && guest?.room_number}</span>
                            </div>
                            <div>
                                <label>{texts.connected.guest.full_name}:</label>
                                <span>{guest && guest?.full_name}</span>
                            </div>
                        </StyledList>
                    </>
                )}

                <StyledInstructions>
                    {texts.connected.plan_title as string}
                </StyledInstructions>
                <StyledList>
                    {
                        plan &&
                        Object.entries(plan).map(([key, value]) => key !== 'bandwidth' && value !== 0 && value !== '' && (
                            <div key={key}>
                                <label>{texts.connected.plan[key] as string}:</label>
                                <span>{value as string}</span>
                                {key === 'duration' && ('minutes')}
                            </div>
                        ))
                    }
                    <div>
                        <label>{texts.connected.plan.bandwidth.download}:</label>
                        <span>{plan && plan?.bandwidth?.download}kbps</span>
                    </div>
                    <div>
                        <label>{texts.connected.plan.bandwidth.upload}:</label>
                        <span>{plan && plan?.bandwidth?.upload}kbps</span>
                    </div>
                </StyledList>


                <StyledButton onClick={handleClick}>{texts.general.disconnect}</StyledButton>
            </ >
    );
};

export default Connected;
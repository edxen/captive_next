import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { fetchAPI, getCurrentTranslation } from "../components/utils";
import Layout from "../components/layout";
import { Site, Guest, BillPlan } from '../components/inteface';
import { StyledButton, StyledHeader, StyledInstructions, StyledList } from '../styled/authentication';

const texts = getCurrentTranslation();

const Connected = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [site, setSite] = useState<Site | null>(null);

    const router = useRouter();

    const handleClick = async () => {
        const result = confirm('Are you sure?');
        if (result) {
            setIsLoading(true);
            await fetchAPI({ target: 'handler', method: 'POST', body: { action: 'disconnect' } });
            router.push('/');
        }
    };

    useEffect(() => {
        const fetchSite = async () => {
            const data = await fetchAPI({ target: "handler", method: 'GET' });
            if (data) {
                setIsLoading(false);
                setSite(data.site);
            }
        };
        fetchSite();
    }, []);

    const signed_in = (site?.signed_in) && site.signed_in;
    const guest: Partial<Guest> | undefined = (signed_in) && signed_in.guest;
    const connected = (site?.connected) && site.connected;
    const billPlan: Partial<BillPlan> | undefined = (connected) && connected?.bill_plan;

    const interpolateText = (text: string, reference: string): string => {
        const replacedMessage: string = text.replace(/\{([^{}]+)\}/g, reference);
        return replacedMessage;
    };

    return (
        <Layout isLoading={isLoading}>
            <StyledHeader>
                {signed_in?.status
                    ? <> {interpolateText(texts.connected.welcome_guest, guest?.first_name as string)}
                    </>
                    : <> {texts.connected.welcome}
                    </>
                }
            </StyledHeader>
            <StyledInstructions>
                You are now connected
            </StyledInstructions>

            {guest && guest.uuid && (
                <>
                    <StyledInstructions>
                        Guest Information:
                    </StyledInstructions>
                    <StyledList>
                        <div>
                            <label>{texts.guest.room_number}:</label>
                            <span>{guest && guest?.room_number}</span>
                        </div>
                        <div>
                            <label>{texts.guest.full_name}:</label>
                            <span>{guest && guest?.full_name}</span>
                        </div>
                    </StyledList>
                </>
            )}

            <StyledInstructions>
                Plan Information:
            </StyledInstructions>
            <StyledList>
                {
                    billPlan &&
                    Object.entries(billPlan).map(([key, value]) => key !== 'bandwidth' && value !== 0 && value !== '' && (
                        <div key={key}>
                            <label>{texts.bill_plan[key] as string}:</label>
                            <span>{value as string}</span>
                            {key === 'duration' && ('minutes')}
                        </div>
                    ))
                }
                <div>
                    <label>{texts.bill_plan.bandwidth.download}:</label>
                    <span>{billPlan && billPlan?.bandwidth?.download}kbps</span>
                </div>
                <div>
                    <label>{texts.bill_plan.bandwidth.upload}:</label>
                    <span>{billPlan && billPlan?.bandwidth?.upload}kbps</span>
                </div>
            </StyledList>


            <StyledButton onClick={handleClick}>{texts.buttons.disconnect}</StyledButton>
        </Layout >
    );
};

export default Connected;
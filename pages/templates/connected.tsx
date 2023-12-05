import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getCurrentTranslation } from "../../components/utils";
import Layout from "../../components/layout";
import { Site, Guest, Plan } from '../../components/inteface';
import { StyledButton, StyledHeader, StyledInstructions, StyledList } from '../../styled/authentication';

const texts = getCurrentTranslation();

const Connected = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
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

    }, []);

    const signed_in = (site?.signed_in) && site.signed_in;
    const guest: Partial<Guest> | undefined = (signed_in) && signed_in.guest;
    const connected = (site?.connected) && site.connected;
    const plan: Partial<Plan> | undefined = (connected) && connected?.plan;

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
                    plan &&
                    Object.entries(plan).map(([key, value]) => key !== 'bandwidth' && value !== 0 && value !== '' && (
                        <div key={key}>
                            <label>{texts.plan[key] as string}:</label>
                            <span>{value as string}</span>
                            {key === 'duration' && ('minutes')}
                        </div>
                    ))
                }
                <div>
                    <label>{texts.plan.bandwidth.download}:</label>
                    <span>{plan && plan?.bandwidth?.download}kbps</span>
                </div>
                <div>
                    <label>{texts.plan.bandwidth.upload}:</label>
                    <span>{plan && plan?.bandwidth?.upload}kbps</span>
                </div>
            </StyledList>


            <StyledButton onClick={handleClick}>{texts.buttons.disconnect}</StyledButton>
        </Layout >
    );
};

export default Connected;
import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { getCurrentTranslation } from "@/components/utils";
import { StyledButton, StyledTitle, StyledInstructions, StyledList } from '@/styles/styled';
import { SiteContext } from '@/components/context';
import Waiting from './waiting';

const texts = getCurrentTranslation();

const Connected = () => {
    const { site, updateStatus, removeSite } = useContext(SiteContext);
    const router = useRouter();

    const handleClick = async () => {
        const result = confirm(texts.general.confirm_question);
        if (result) {
            removeSite({ guest: site.guest, plan: site.plan });
            updateStatus({ signed_in: false, connected: false, loading: true });
            router.push('/');
        }
    };

    useEffect(() => {
        const toggleLoading = async () => {
            if (router.isReady) {
                if (site.status.connected) updateStatus({ loading: false });
                else router.push('/');
            } else {
                updateStatus({ loading: true });
            }
        };
        toggleLoading();
        // eslint-disable-next-line
    }, [router]);

    const interpolateText = (text: string, reference: string): string => {
        const replacedMessage: string = text.replace(/\{([^{}]+)\}/g, reference);
        return replacedMessage;
    };

    return (
        site.status.loading
            ? <Waiting />
            : <>
                <StyledTitle>
                    {site.guest?.uuid
                        ? <> {interpolateText(texts.connected.title_guest as string, site.guest?.first_name as string)}
                        </>
                        : <> {texts.connected.title}
                        </>
                    }
                </StyledTitle>
                <StyledInstructions>
                    {texts.connected.instructions as string}
                </StyledInstructions>

                {site.guest?.uuid && (
                    <>
                        <StyledInstructions>
                            {texts.connected.guest_title as string}
                        </StyledInstructions>
                        <StyledList>
                            <div>
                                <label>{texts.connected.guest.room_number}:</label>
                                <span>{site.guest?.room_number}</span>
                            </div>
                            <div>
                                <label>{texts.connected.guest.full_name}:</label>
                                <span>{site.guest?.full_name}</span>
                            </div>
                        </StyledList>
                    </>
                )}

                <StyledInstructions>
                    {texts.connected.plan_title as string}
                </StyledInstructions>
                <StyledList>
                    {
                        site.plan &&
                        Object.entries(site.plan).map(([key, value]) => key !== 'bandwidth' && value !== 0 && value !== '' && (
                            <div key={key}>
                                <label>{texts.connected.plan[key] as string}:</label>
                                <span>{value as string}</span>
                                {key === 'duration' && (texts.plan_select.minutes)}
                            </div>
                        ))
                    }
                    <div>
                        <label>{texts.connected.plan.bandwidth.download}:</label>
                        <span>{site.plan?.bandwidth?.download}kbps</span>
                    </div>
                    <div>
                        <label>{texts.connected.plan.bandwidth.upload}:</label>
                        <span>{site.plan?.bandwidth?.upload}kbps</span>
                    </div>
                </StyledList>

                <StyledButton onClick={handleClick}>{texts.general.disconnect}</StyledButton>
            </ >
    );
};

export default Connected;
import { ChangeEvent, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { fetchAPI, FetchAPI, getCurrentTranslation } from '@/components/utils';
import { StyledButton, StyledError, StyledDivider, StyledTitle, StyledInputGroup, StyledInstructions } from '@/styles/styled';
import { SiteContext } from '@/components/context';
import Waiting from './waiting';

const texts = getCurrentTranslation();

const AccessCode = () => {
    const { site, updateSite, updateStatus } = useContext(SiteContext);
    const [accessCode, setAccessCode] = useState<string>('');
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAccessCode(e.target.value);
    };

    const handlePageChange = () => {
        updateStatus({ loading: true });
    };

    const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!accessCode) {
            updateStatus({ error: texts.error.blank_access_code });
        } else {
            updateStatus({ loading: true });

            const accessCodeIsNum = parseInt(accessCode.toString(), 10);
            if (!isNaN(accessCodeIsNum)) {
                const body: FetchAPI['body'] = { action: "connect", type: "code", code: accessCodeIsNum };
                const data = await fetchAPI({ target: "handler", method: "POST", body });
                if (data.success) {
                    updateSite({ plan: data.plan });
                    updateStatus({ connected: true });
                    const redirectPath = '/templates/connected';
                    router.push(redirectPath);
                } else {
                    updateStatus({ loading: false, error: texts.error.invalid_access_code });
                }
            } else {
                updateStatus({ loading: false, error: texts.error.invalid_access_code });
            }
        }
    };

    useEffect(() => {
        if (router.isReady) {
            updateStatus({ loading: false });
        } else {
            updateStatus({ loading: true });
        }
    }, [router, updateStatus]);

    return (
        site.status.loading
            ? <Waiting />
            : <>
                <StyledTitle>
                    {texts.access_code.title}
                </StyledTitle>
                <StyledInstructions>
                    {texts.access_code.instructions}
                </StyledInstructions>
                <form onSubmit={handleConnect}>
                    <StyledInputGroup value={site.status.error}>
                        <label>{texts.access_code.label}</label>
                        <input onChange={handleInputChange} value={accessCode} placeholder={texts.access_code.placeholder}></input>
                    </StyledInputGroup>
                    <StyledError>{site.status.error}</StyledError>
                    <StyledButton>{texts.general.connect}</StyledButton>
                </form>

                <StyledDivider>
                    {texts.general.or_via}
                </StyledDivider>

                <Link href="/templates/authentication">
                    <StyledButton onClick={handlePageChange}>
                        {texts.general.login_guest}
                    </StyledButton>
                </Link>
            </>
    );
};

export default AccessCode;
import { ChangeEvent, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { fetchAPI, getCurrentTranslation } from "@/components/utils";
import { StyledInputGroup, StyledError, StyledButton, StyledTitle, StyledInstructions, StyledDivider } from '@/styles/styled';
import { SiteContext } from '@/components/context';

import { Credentials } from '@/components/utils';

import Waiting from './waiting';

const texts = getCurrentTranslation();

const Authentication = () => {
    const [credentials, setCredentials] = useState<Credentials>({ room_number: undefined, last_name: '' });
    const { site, updateSite, updateStatus } = useContext(SiteContext);
    const router = useRouter();

    const handlePageChange = () => {
        updateStatus({ loading: true });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredentials((prevCredentials) => ({ ...prevCredentials, [e.target.id]: e.target.value }));
        updateStatus({ error: '' });
    };

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateStatus({ error: '' });

        const emptyCredentials: boolean = Object.values(credentials).some(credential => credential === '');
        if (emptyCredentials) {
            updateStatus({ error: texts.error.blank_credentials });
        } else {
            updateStatus({ loading: true });
            const data = await fetchAPI({ target: "handler", method: "POST", body: { action: 'signin', credentials } });
            if (data.success) {
                updateStatus({ error: '', signed_in: true });
                updateSite({ guest: data.guest });
                const redirectPath: string = '/templates/plan_select';
                router.push(redirectPath);
            } else {
                updateStatus({ loading: false, error: texts.error.invalid_credentials });
            }
        }
    };

    return (
        site.status.loading
            ? <Waiting />
            : <>
                <form onSubmit={handleSignIn}>
                    <StyledTitle>
                        {texts.authentication.title}
                    </StyledTitle>
                    <StyledInstructions>
                        {texts.authentication.instructions}
                    </StyledInstructions>
                    {
                        Object.keys(credentials).map((credential, index: number) => (
                            <StyledInputGroup key={index} value={site.status.error}>
                                <label>{texts.authentication[`label_${credential}`]}</label>
                                <input id={credential} onChange={handleInputChange} defaultValue={credentials[credential as keyof Credentials]} placeholder={texts.authentication[`placeholder_${credential}`]} />
                            </StyledInputGroup>
                        ))
                    }
                    <StyledError>{site.status.error}</StyledError>
                    <StyledButton>{texts.general.sign_in}</StyledButton>
                </form>

                <StyledDivider>
                    {texts.general.or_via}
                </StyledDivider>

                <Link href="/templates/access_code">
                    <StyledButton onClick={handlePageChange}>
                        {texts.general.login_access_code}
                    </StyledButton>
                </Link>
            </>
    );
};

export default Authentication;
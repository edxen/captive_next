import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { fetchAPI, getCurrentTranslation } from "@/components/utils";
import { StyledInputGroup, StyledError, StyledButton, StyledTitle, StyledInstructions, StyledDivider } from '@/styles/styled';
import Waiting from './waiting';

const texts = getCurrentTranslation();

interface Credentials {
    room_number: string;
    last_name: string;
}

const Authentication = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [credentials, setCredentials] = useState<Credentials>({ room_number: '', last_name: '' });
    const router = useRouter();

    const handlePageChange = () => {
        setIsLoading(true);
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredentials((prevCredentials) => ({ ...prevCredentials, [e.target.id]: e.target.value }));
        setErrorMessage('');
    };

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');

        const emptyCredentials: boolean = Object.values(credentials).some(credential => credential === '');
        if (emptyCredentials) {
            setErrorMessage(texts.error.blank_credentials);
        } else {
            setIsLoading(true);
            const data = await fetchAPI({ target: "readFirebaseFile", method: "POST", body: { action: 'signin', ...credentials } });
            if (data.success) {
                router.push(`/templates/bill_plan?gid=${data.guest.uuid}`);
            } else {
                setErrorMessage(texts.error.invalid_credentials);
                setIsLoading(false);
            }
        }
    };

    return (
        isLoading
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
                            <StyledInputGroup key={index} value={errorMessage}>
                                <label>{texts.authentication[`label_${credential}`]}</label>
                                <input id={credential} onChange={handleInputChange} defaultValue={credentials[credential as keyof Credentials]} placeholder={texts.authentication[`placeholder_${credential}`]} />
                            </StyledInputGroup>
                        ))
                    }
                    <StyledError>{errorMessage}</StyledError>
                    <StyledButton>{texts.general.sign_in}</StyledButton>
                </form>

                <StyledDivider>
                    {texts.general.or}
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
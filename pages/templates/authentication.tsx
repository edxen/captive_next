import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { fetchAPI, getCurrentTranslation } from "../../components/utils";
import { StyledInputGroup, StyledError, StyledButton, StyledTitle, StyledInstructions, StyledDivider } from '../../styled/components';
import Waiting from './waiting';

const texts = getCurrentTranslation();

const Authentication = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [credentials, setCredentials] = useState<{ [key: string]: string; }>({ room_number: '', last_name: '' });

    const router = useRouter();

    const handleClick = () => {
        setIsLoading(true);
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredentials((prevCredentials) => ({ ...prevCredentials, [e.target.id]: e.target.value }));
        setErrorMessage('');
    };

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage('');
        const emptyCredentials: boolean = Object.values(credentials).every(credential => credential === '');
        if (emptyCredentials) {
            setErrorMessage(texts.error.blank_credentials);
        } else {
            setIsLoading(true);
            const data = await fetchAPI({ target: "readFirebaseFile", method: "POST", body: { action: 'signin', ...credentials } });
            if (data.success) {
                router.push(`/templates/bill_plan?gid=${data.guest.uuid}`);
            } else {
                setIsLoading(false);
                setErrorMessage(texts.error.invalid_credentials);
            }
        }
    };

    return (
        isLoading
            ? <Waiting />
            : <>
                <form onSubmit={handleSignIn}>
                    <StyledTitle>
                        Guest Login
                    </StyledTitle>
                    <StyledInstructions>
                        Sign in to get connected with our high speed internet.
                    </StyledInstructions>
                    {
                        Object.keys(credentials).map((credential, index) => (
                            <StyledInputGroup key={index}
                                value={errorMessage}>

                                <label>{texts.credentials[`label_${credential}`]}</label>
                                <input id={credential} onChange={handleChange} defaultValue={credentials[credential]} placeholder={texts.credentials[`placeholder_${credential}`]} />
                            </StyledInputGroup>
                        ))
                    }
                    <StyledError>{errorMessage}</StyledError>
                    <StyledButton>{texts.buttons.sign_in}</StyledButton>
                </form>

                <StyledDivider>
                    or connect via:
                </StyledDivider>

                <Link href="/templates/access_code">
                    <StyledButton onClick={handleClick}>
                        {texts.buttons.login_access_code}
                    </StyledButton>
                </Link>
            </>
    );
};

export default Authentication;
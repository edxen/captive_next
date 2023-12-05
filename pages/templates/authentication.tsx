import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { fetchAPI, getCurrentTranslation } from "../../components/utils";
import { Data } from '../../components/inteface';

import Layout from "../../components/layout";
import { StyledInputGroup, StyledError, StyledButton, StyledHeader, StyledInstructions, StyledDivider } from '../../styled/authentication';

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
            const data = await fetchAPI({ target: "readFirebaseFile", method: "POST", body: { action: 'signin', ...credentials } }) as Data;
            if (data.success) {
                router.push('/templates/bill_plan');
            } else {
                setIsLoading(false);
                setErrorMessage(texts.error.invalid_credentials);
            }
        }
    };

    return (
        <>
            <Layout isLoading={isLoading}>
                <form onSubmit={handleSignIn}>
                    <StyledHeader>
                        Guest Login
                    </StyledHeader>
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
            </Layout>
        </>
    );
};

export default Authentication;
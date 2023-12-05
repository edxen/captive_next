import { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from "../../components/layout";
import { fetchAPI, FetchAPI, getCurrentTranslation } from '../../components/utils';
import { StyledButton, StyledError, StyledDivider, StyledHeader, StyledInputGroup, StyledInstructions } from '../../styled/authentication';

const texts = getCurrentTranslation();

const AccessCode = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputAccessCode, setInputAccessCode] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputAccessCode(e.target.value);
    };

    const handleClick = () => {
        setIsLoading(true);
    };

    const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (inputAccessCode === "") {
            setErrorMessage(texts.error.blank_access_code);
        } else {
            setIsLoading(true);
            const body: FetchAPI['body'] = { action: "connect", type: "code", code: inputAccessCode };
            const data = await fetchAPI({ target: "readFirebaseFile", method: "POST", body });
            console.log(data);
            if (data.success) {
                router.push('/templates/connected');
            } else {
                setIsLoading(false);
                setErrorMessage(texts.error.invalid_access_code);
            }
        }
    };

    return (
        <Layout isLoading={isLoading}>
            <StyledHeader>
                Access Code Login
            </StyledHeader>
            <StyledInstructions>
                Approach our front desk to request for access code.
            </StyledInstructions>
            <form onSubmit={handleConnect}>
                <StyledInputGroup value={errorMessage}>
                    <label>{texts.access_code.label}</label>
                    <input onChange={handleChange} value={inputAccessCode} placeholder={texts.access_code.placeholder}></input>
                </StyledInputGroup>
                <StyledError>{errorMessage}</StyledError>
                <StyledButton>{texts.buttons.connect}</StyledButton>
            </form>

            <StyledDivider>
                or connect via:
            </StyledDivider>

            <Link href="/templates/authentication">
                <StyledButton onClick={handleClick}>
                    {texts.buttons.login_guest}
                </StyledButton>
            </Link>
        </Layout >
    );
};

export default AccessCode;
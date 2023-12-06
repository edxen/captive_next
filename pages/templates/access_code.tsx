import { ChangeEvent, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { fetchAPI, FetchAPI, getCurrentTranslation } from '@/components/utils';
import { StyledButton, StyledError, StyledDivider, StyledTitle, StyledInputGroup, StyledInstructions } from '@/styles/styled';
import Waiting from './waiting';
import { SiteContext } from '../_app';

const texts = getCurrentTranslation();

const AccessCode = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputAccessCode, setInputAccessCode] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputAccessCode(e.target.value);
    };

    const handlePageChange = () => {
        setIsLoading(true);
    };

    const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (inputAccessCode === "") {
            setErrorMessage(texts.error.blank_access_code);
        } else {
            setIsLoading(true);
            const body: FetchAPI['body'] = { action: "connect", type: "code", code: inputAccessCode };
            const data = await fetchAPI({ target: "handler", method: "POST", body });
            if (data.success) {
                router.push(`/templates/connected?pid=${data.plan.uuid}&aid=${data.plan.code}`);
            } else {
                setErrorMessage(texts.error.invalid_access_code);
                setIsLoading(false);
            }
        }
    };

    return (
        isLoading
            ? <Waiting />
            : <>
                <StyledTitle>
                    {texts.access_code.title}
                </StyledTitle>
                <StyledInstructions>
                    {texts.access_code.instructions}
                </StyledInstructions>
                <form onSubmit={handleConnect}>
                    <StyledInputGroup value={errorMessage}>
                        <label>{texts.access_code.label}</label>
                        <input onChange={handleInputChange} value={inputAccessCode} placeholder={texts.access_code.placeholder}></input>
                    </StyledInputGroup>
                    <StyledError>{errorMessage}</StyledError>
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
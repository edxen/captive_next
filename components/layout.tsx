import React from 'react';

import { getCurrentTranslation } from './utils';
import { StyledContainer, StyledContent, StyledHeader, StyledFooter, StyledLogo } from '@/styles/styled';
import Waiting from '@/pages/templates/waiting';

const texts = getCurrentTranslation();

interface LayoutProps {
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isLoading, children }) => {
    return (
        <StyledContainer>
            <Header />
            <StyledContent>
                {isLoading
                    ? <Waiting />
                    : <>{children}</>
                }
            </StyledContent>
            <Footer />
        </StyledContainer>
    );
};

const Header = () => {
    return (
        <StyledHeader>
            <StyledLogo />
            <StyledHeader>
                {texts.layout.header}
            </StyledHeader>
        </StyledHeader>
    );
};

const Footer = () => {
    return (
        <StyledFooter>
            {texts.layout.footer}
        </StyledFooter>
    );
};

export default Layout;
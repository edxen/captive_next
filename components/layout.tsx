import React from 'react';

import { getCurrentTranslation } from './utils';
import { StyledContainer, StyledContent, StyledHeader, StyledFooter, StyledLogo } from '@/styles/styled';

const texts = getCurrentTranslation();

interface LayoutProps {
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <StyledContainer>
            <Header />
            <StyledContent>
                {children}
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
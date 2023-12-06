import React from 'react';

import { getCurrentTranslation } from './utils';
import { StyledContainer, StyledContent, StyledHeader, StyledFooter } from '@/styles/styled';
import Image from 'next/image';

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
            <Image src="/logo.webp" alt="captive site logo" width={150} height={150} />
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
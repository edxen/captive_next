import React from 'react';
import { StyledContainer, StyledContent, StyledHeader, StyledFooter, StyledLogo } from '../styled/components';

import Waiting from '../pages/templates/waiting';

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
                Welcome to Outlast Resort
            </StyledHeader>
        </StyledHeader>
    );
};

const Footer = () => {
    return (
        <StyledFooter>
            Happysight © 2023 Edxen. All rights reversed.
        </StyledFooter>
    );
};

export default Layout;
import React from 'react';
import { Container, Content, StyledHeader, StyledFooter, StyledLogo } from '../styled/layout';

import Waiting from '../pages/templates/waiting';

interface LayoutProps {
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isLoading, children }) => {
    return (
        <Container>
            <Header />
            <Content>
                {isLoading
                    ? <Waiting />
                    : <>{children}</>
                }
            </Content>
            <Footer />
        </Container>
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
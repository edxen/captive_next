import React from 'react';
import { Container, Content, Footer, Header, StyledLogo } from '../styled/layout';

import Waiting from '../templates/waiting';
import { StyledHeader } from '../styled/authentication';

interface LayoutProps {
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isLoading, children }) => {
    return (
        <Container>
            <Header>
                <StyledLogo />
                <StyledHeader>
                    Welcome to Outlast Resort
                </StyledHeader>
            </Header>
            <Content>
                {isLoading
                    ? <Waiting />
                    :
                    <>
                        {children}
                    </>
                }
            </Content>
            <Footer>
                Happysight © 2023 Edxen. All rights reversed.
            </Footer>
        </Container>
    );
};

export default Layout;
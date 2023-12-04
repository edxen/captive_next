import React from 'react';
import { Container, Content, Footer, Header, StyledLogo } from '../styled/layout';

import Waiting from '../templates/waiting';
import { StyledHeaders } from '../styled/authentication';

interface LayoutProps {
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isLoading, children }) => {
    return (
        <Container>
            <Header>
                <StyledLogo />
                <StyledHeaders>
                    Welcome to Outlast Resort
                </StyledHeaders>
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
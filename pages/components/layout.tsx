import React from 'react';
import Waiting from '../templates/waiting';

interface LayoutProps {
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isLoading, children }) => {
    return (
        <>
            <div>
                <h2>This is for header</h2>
            </div>
            {isLoading
                ? <Waiting />
                :
                <>
                    {children}
                </>
            }
            <div>
                <h2>This is for footer</h2>
            </div>
        </>
    );
};

export default Layout;
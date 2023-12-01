import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <div>
                <h2>This is for header</h2>
            </div>
            {children}
            <div>
                <h2>This is for footer</h2>
            </div>
        </>
    );
};

export default Layout;
import { createContext, useState } from 'react';

const defaultSite: Site = {
    login_options: {
        authentication: true,
        access_code: true
    },
    status: {
        signed_in: false,
        connected: false,
        loading: false,
        error: ""
    },
    plans: [],
    guest: {} as Guest,
    plan: {} as Plan
};

export const SiteContext = createContext<SiteContextType>({
    site: defaultSite,
    setSite: () => { }
});

export const SiteProvider: React.FC<SiteProviderType> = ({ children }) => {
    const [site, setSite] = useState<Site>(defaultSite);
    const context = { site, setSite };

    return (
        <SiteContext.Provider value={context}>
            {children}
        </SiteContext.Provider>
    );
};
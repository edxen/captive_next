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
    setSite: () => { },
    updateSite: () => { },
    updateStatus: () => { }
});

export const SiteProvider: React.FC<SiteProviderType> = ({ children }) => {
    const [site, setSite] = useState<Site>(defaultSite);

    const updateStatus = (obj: Partial<Status>) => {
        setSite((prevSite) => ({ ...prevSite, status: { ...prevSite.status, ...obj } }));
    };

    const updateSite = (obj: Partial<Site>) => {
        setSite((prevSite) => ({ ...prevSite, ...obj }));
    };

    const context = { site, setSite, updateStatus, updateSite };

    return (
        <SiteContext.Provider value={context}>
            {children}
        </SiteContext.Provider>
    );
};
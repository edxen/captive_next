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
    updateStatus: () => { },
    removeSite: () => { }
});

export const SiteProvider: React.FC<SiteProviderType> = ({ children }) => {
    const [site, setSite] = useState<Site>(defaultSite);

    const updateStatus = (obj: Partial<Status>) => {
        setSite((prevSite) => ({ ...prevSite, status: { ...prevSite.status, ...obj } }));
    };

    const updateSite = (obj: Partial<Site>) => {
        setSite((prevSite) => ({ ...prevSite, ...obj }));
    };

    const removeSite = (key: Partial<Site>) => {
        setSite((prevSite) => {
            const currentSite = { ...prevSite };
            for (const k in key) {
                if (Object.prototype.hasOwnProperty.call(key, k)) {
                    delete currentSite[k as keyof Site];
                }
            }
            return currentSite;
        });
    };

    const context = { site, setSite, updateStatus, updateSite, removeSite };

    return (
        <SiteContext.Provider value={context}>
            {children}
        </SiteContext.Provider>
    );
};
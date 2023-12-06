interface Guest {
    uuid: number;
    room_number: number;
    first_name: string;
    last_name: string;
}

interface PlanBandwidth {
    download: number;
    upload: number;
}

interface Plan {
    uuid: number;
    full_name: string;
    duration: number;
    code?: number;
    type: string;
    bandwidth: PlanBandwidth;
}

interface Site {
    login_options: {
        authentication: boolean;
        access_code: boolean;
    };
    status: {
        signed_in: boolean;
        connected: boolean;
    };
    plans: Plan[];
    guest?: Guest;
    plan?: Plan;
}

interface SiteContextType {
    site: Site;
    setSite: React.Dispatch<React.SetStateAction<Site>>;
}

interface SiteProviderType {
    children: React.ReactNode;
}
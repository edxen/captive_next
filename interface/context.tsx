interface Guest {
    uuid: number;
    room_number: number;
    full_name: string;
    first_name: string;
    last_name: string;
}

interface PlanBandwidth {
    download: number;
    upload: number;
}

interface Plan {
    uuid: number;
    name: string;
    amount: number;
    duration: number;
    code?: number;
    type: string;
    bandwidth: PlanBandwidth;
}

interface Status {
    signed_in: boolean;
    connected: boolean;
    loading: boolean;
    error: string;
}

interface LoginOptions {
    authentication: boolean;
    access_code: boolean;
}

interface Site {
    login_options: LoginOptions;
    status: Status;
    plans: Plan[];
    guest?: Guest;
    plan?: Plan;
}

interface SiteContextType {
    site: Site;
    setSite: React.Dispatch<React.SetStateAction<Site>>;
    updateStatus: (obj: Partial<Status>) => void;
    updateSite: (obj: Partial<Site>) => void;
    removeSite: (obj: Partial<Site>) => void;
}

interface SiteProviderType {
    children: React.ReactNode;
}
export type StringKey = {
    [key: string]: string;
};

export interface Translations {
    credentials: StringKey;
    error: StringKey;
}

export interface Texts {
    languages: StringKey;
    translations: {
        en: Translations;
    };
}

export interface Credentials {
    room_number: number | undefined;
    last_name: string;
}

export interface BillPlan {
    uuid: number,
    name: string,
    duration: number,
    type: string,
    amount: number,
    bandwidth: { [key: string]: number; };
}

export interface Guest {
    uuid: number;
    room_number: number;
    full_name: string;
    first_name: string;
    last_name: string;
    code: string;
}

export interface SignedIn {
    status: boolean;
    guest: Guest | {};
}

export interface Site {
    login_options: { [key: string]: boolean; };
    bill_plans: BillPlan[] | [];
    signed_in: SignedIn;
    connected: {
        status: boolean;
        bill_plan: BillPlan | {};
    };
}

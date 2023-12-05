export type StringKey = {
    [key: string]: string;
};

export interface Voucher {
    [key: string]: string;
}

export interface Data {
    message: string;
    success: boolean;
    site: Site;
}

export interface Plan {
    uuid: string,
    code: string,
    name: string,
    duration: number,
    type: string,
    amount: number,
    bandwidth: { [key: string]: number; };
}

export interface Guest {
    uuid: string;
    room_number: string;
    full_name: string;
    first_name: string;
    last_name: string;
    code: string;
}

export interface SignedIn {
    status: boolean;
    guest?: Guest;
}

export interface Site {
    plans?: Plan[] | [];
    signed_in?: SignedIn;
    connected?: {
        status: boolean;
        plan: Plan | {};
    };
}

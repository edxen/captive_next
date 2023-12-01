export interface BillPlan {
    uuid: number,
    plan_name: string,
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
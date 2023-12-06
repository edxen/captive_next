import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import { Body, Voucher } from '@/components/utils';

let firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
if (!firebaseConfig.apiKey) {
    try {
        firebaseConfig = require('@/.env/firebase.json');
    } catch (error) {
        console.error('.env/firebase.json does not exist');
    }
}

let firebaseApp;
if (!firebaseApp) firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const loadData = async (filePath: string) => {
    const storageRef = ref(storage, filePath);
    const url = await getDownloadURL(storageRef);
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('failed to fetch data');
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const pmsPath = 'pms.json';
        const plansPath = 'plans.json';
        const voucherPath = 'vouchers.json';

        let pmsData: Guest[];
        let plansData: Plan[];
        let vouchersData: Voucher[];

        let success = false;
        let guest: Guest | undefined;
        let plans: Plan[] | undefined;
        let selectedPlan = {} as Plan;
        const { action, type, code, credentials, uuid }: Body = req.body;

        switch (req.method) {
            case "POST":
                switch (action) {
                    case "signin": // for when user is signing in, check each record if provided credentials matched 
                        pmsData = await loadData(pmsPath);
                        if (credentials?.room_number) {
                            const { room_number, last_name } = credentials;
                            const roomNumber = parseInt(room_number.toString(), 10);
                            if (!isNaN(roomNumber)) {
                                guest = pmsData.find((data) => data.room_number === roomNumber && data.last_name === last_name);
                                if (guest?.uuid) success = true;
                            }
                        }
                        res.status(200).json({ message: 'This is a POST request', success, guest });
                        break;

                    // retrieve all plans available
                    case "get_plans":
                        success = true;
                        plans = await loadData(plansPath);

                        // only return guest relevant plans
                        if (plans && type === 'guest_only') {
                            plans = plans.filter((plan) => plan.type !== 'voucher');
                        }
                        res.status(200).json({ message: 'This is a POST request', success, plans });
                        break;

                    // connect user based on selected plan or voucher
                    case "connect":
                        const getPlan = (uuid: number) => plansData?.filter((plan) => plan.uuid === uuid)[0] as Plan;
                        const getVoucher = (uuid: number) => vouchersData?.filter((voucher) => voucher.code === code)[0] as Voucher;

                        switch (type) {
                            // return selected plan
                            case 'plan':
                                if (uuid) {
                                    const uuidAsNum = parseInt(uuid.toString(), 10);
                                    if (!isNaN(uuidAsNum)) {
                                        success = true;
                                        plansData = await loadData(plansPath);
                                        selectedPlan = getPlan(uuidAsNum);
                                    }
                                }
                                break;

                            // validate voucher and return associated plan
                            case 'code':
                                if (code) {
                                    const codeAsNum = parseInt(code.toString(), 10);
                                    if (!isNaN(codeAsNum)) {
                                        vouchersData = await loadData(voucherPath);
                                        const voucher = getVoucher(codeAsNum);
                                        if (voucher) {
                                            success = true;
                                            plansData = await loadData(plansPath);
                                            selectedPlan = getPlan(voucher.plan_uuid);
                                            selectedPlan.code = codeAsNum;
                                        }
                                    }
                                }
                                break;
                        }
                        res.status(200).json({ message: 'This is a POST request', success, plan: selectedPlan });
                        break;

                    default:
                        res.status(400).json({ message: `invalid action`, success });
                        break;
                }
                break;
            default:
                res.status(400).json({ message: `invalid method`, success, firebaseConfig });
                break;
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to read file from Firebase Storage' });
    }
}
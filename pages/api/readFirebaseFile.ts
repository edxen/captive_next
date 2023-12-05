import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Guest, Plan, Voucher } from '@/components/inteface';

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
        const plansPath = 'bill_plans.json';
        const voucherPath = 'voucher.json';

        let pmsData: Guest[];
        let plansData: Plan[];
        let voucherData: Voucher[];

        let success = false;
        let guest: Guest | undefined;
        let plans: Plan[] | undefined;
        let selectedPlan = {} as Plan;
        const { action, type, guestuuid, plan, code, room_number, last_name } = req.body;

        switch (req.method) {
            case "POST":
                switch (action) {
                    case "guest":
                        pmsData = await loadData(pmsPath);
                        success = true;
                        guest = pmsData.find((data) => data.uuid === guestuuid);
                        res.status(200).json({ message: 'This is a POST request', success, guest });
                        break;
                    case "signin":
                        pmsData = await loadData(pmsPath);
                        const foundGuest = pmsData.find((data) => data.room_number === room_number);

                        if (foundGuest?.last_name === last_name) {
                            success = true;
                            guest = foundGuest;
                        }
                        res.status(200).json({ message: 'This is a POST request', success, guest });
                        break;
                    case "plan":
                        success = true;
                        plansData = await loadData(plansPath);
                        selectedPlan = plansData.filter((list) => list.uuid = plan)[0];
                        res.status(200).json({ message: 'This is a POST request', success, plan: selectedPlan });
                        break;
                    case "plans":
                        success = true;
                        plansData = await loadData(plansPath);
                        if (type === 'guest') {
                            plans = plansData.filter((plan) => plan.type !== 'voucher');
                        } else if (type === 'all') {
                            plans = plansData;
                        }
                        res.status(200).json({ message: 'This is a POST request', success, plans });
                        break;
                    case "connect":
                        plansData = await loadData(plansPath);
                        const getPlan = (uuid: string) => plansData?.filter((plan) => plan.uuid === uuid)[0] as Plan;

                        switch (type) {
                            case 'plan':
                                success = true;
                                selectedPlan = getPlan(plan);
                                break;

                            case 'code':
                                voucherData = await loadData(voucherPath);
                                console.log(voucherData);
                                const found = voucherData.filter((voucher) => voucher.code === code)[0];
                                console.log(found);

                                if (found) {
                                    success = true;
                                    selectedPlan = getPlan(found.code);
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
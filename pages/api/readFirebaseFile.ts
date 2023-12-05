import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Guest, BillPlan } from '@/components/inteface';

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
        const billplansPath = 'bill_plans.json';

        let success = false;
        let guest: Guest | undefined;
        let billplans: BillPlan[] | undefined;
        const { action, type } = req.body;

        switch (req.method) {
            case "POST":
                switch (action) {
                    case "signin":
                        const { room_number, last_name } = req.body;
                        const pmsData: Guest[] = await loadData(pmsPath);
                        const foundGuest = pmsData.find((data) => data.room_number === room_number);

                        if (foundGuest?.last_name === last_name) {
                            success = true;
                            guest = foundGuest;
                        }
                        res.status(200).json({ message: 'This is a POST request', success, guest });
                        break;

                    case "billplans":
                        success = true;
                        const billplanData: BillPlan[] = await loadData(billplansPath);
                        if (type === 'guest') {
                            billplans = billplanData.filter((plan) => plan.type !== 'voucher');
                        } else if (type === 'all') {
                            billplans = billplanData;
                        }
                        res.status(200).json({ message: 'This is a POST request', success, billplans });
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
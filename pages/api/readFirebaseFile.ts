import { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

import { Guest, BillPlan } from '@/components/inteface';

const serviceAccount = require('../../.env/captive-next-firebase.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://captive-next.appspot.com'
    });
}

async function loadData(filePath: string) {
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    const fileJSONContent = await file.download();
    return JSON.parse(fileJSONContent.toString());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const bucket = admin.storage().bucket();

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

                    default:
                        res.status(400).json({ message: `invalid action`, success });
                        break;
                }
            default:
                res.status(400).json({ message: `invalid method`, success });
                break;
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to read file from Firebase Storage' });
    }
}
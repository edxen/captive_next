// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { BillPlan, Guest } from '../components/inteface';

const app = express();
app.use(express.json());

type Data = {
    message: string;
    success?: boolean;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    if (req.method === "POST") {
        try {
            const { action, room_number, last_name } = req.body;

            const pmsPath = path.join(process.cwd(), 'data', 'pms.json');
            const pmsRef = fs.readFileSync(pmsPath, 'utf-8');
            const pmsData = JSON.parse(pmsRef);
            const guest = pmsData.filter((data: Guest) => data.room_number === Number(room_number))[0];
            const success = (guest?.last_name === last_name) ? true : false;
            if (success) {
                const sitePath = path.join(process.cwd(), 'data', 'site.json');
                const siteRef = fs.readFileSync(sitePath, 'utf-8');
                const siteData = JSON.parse(siteRef);
                siteData.signed_in = {
                    status: true,
                    guest: guest
                };
                const billPlanPath = path.join(process.cwd(), 'data', 'bill_plans.json');
                const billPlanRef = fs.readFileSync(billPlanPath, 'utf-8');
                const billPlanData = JSON.parse(billPlanRef);
                siteData.bill_plans = billPlanData.filter((billPlan: BillPlan) => billPlan.type !== 'voucher');
                console.log(siteData);
                fs.writeFileSync(sitePath, JSON.stringify(siteData, null, 2));
            }
            res.status(200).json({ message: 'this is a POST Request', success });
        } catch (error) {
            console.error(`there was an error: ${error}`);
        }
    } else {
        res.end();
    }
}
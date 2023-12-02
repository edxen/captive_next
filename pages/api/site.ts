// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { BillPlan, Site } from '../components/inteface';

const app = express();
app.use(express.json());

type Data = {
    message: string;
    site: Site;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    if (req.method === "GET") {
        try {
            const sitePath = path.join(process.cwd(), 'data', 'site.json');
            const siteRef = fs.readFileSync(sitePath, 'utf-8');
            const siteData = JSON.parse(siteRef);
            res.status(200).json({ message: 'this is a GET Request', site: siteData });
        } catch (error) {
            console.error(`there was an error: ${error}`);
        }
    } else if (req.method === "POST") {
        try {
            const { action, plan_uuid } = req.body;

            const sitePath = path.join(process.cwd(), 'data', 'site.json');
            const siteRef = fs.readFileSync(sitePath, 'utf-8');
            const siteData = JSON.parse(siteRef);

            const billPlanPath = path.join(process.cwd(), 'data', 'bill_plans.json');
            const billPlanRef = fs.readFileSync(billPlanPath, 'utf-8');
            const billPlanData = JSON.parse(billPlanRef);

            switch (action) {
                case "signout":
                    siteData.signed_in = {
                        status: false,
                        guest: {}
                    };
                    break;
                case "connect":
                    siteData.bill_plans = [];
                    siteData.connected = {
                        status: true,
                        bill_plan: billPlanData.filter((billplan: BillPlan) => billplan.uuid === Number(plan_uuid))[0]
                    };
                    break;
                case "disconnect":
                    siteData.bill_plans = [];
                    siteData.signed_in = {
                        status: false,
                        guest: {}
                    };
                    siteData.connected = {
                        status: false,
                        bill_plan: {}
                    };
            }

            fs.writeFileSync(sitePath, JSON.stringify(siteData, null, 2));
            res.status(200).json({ message: 'this is a POST Request', site: siteData });
        } catch (error) {
            console.error(`there was an error: ${error}`);
        }
    } else {
        res.end();
    }
}
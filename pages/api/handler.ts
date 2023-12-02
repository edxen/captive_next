// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Site, BillPlan, Guest, StringKey } from '../components/inteface';

type Data = {
    message: string;
    success?: boolean;
    site?: Site;
};

const readJSONFile = (filePath: string): any => {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
};
const writeJSONFile = (filePath: string, data: any): void => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const setPath = (fileName: string) => path.join(process.cwd(), 'data', `${fileName}.json`);

    const paths: StringKey = {
        pms: setPath('pms'),
        site: setPath('site'),
        bill_plans: setPath('bill_plans'),
    };
    const data: any = {
        pms: readJSONFile(paths.pms),
        site: readJSONFile(paths.site),
        bill_plans: readJSONFile(paths.bill_plans)
    };

    try {
        switch (req.method) {
            case "GET":
                res.status(200).json({ message: 'this is a GET Request', site: data.site });
                break;
            case "POST":
                const { action } = req.body;

                const clearBillPlans = () => data.site.bill_plans = [];
                const clearSignedIn = () => data.site.signed_in = { status: false, guest: {} };
                const clearConnected = () => data.site.connected = { status: false, bill_plan: {} };

                switch (action) {
                    case "signin":
                        const { room_number, last_name } = req.body;
                        const guest = data.pms.filter((data: Guest) => data.room_number === Number(room_number))[0];
                        const success = (guest?.last_name === last_name) ? true : false;
                        if (success) {
                            const getGuestPlans = data.bill_plans.filter((billPlan: BillPlan) => billPlan.type !== 'voucher');
                            data.site.bill_plans = getGuestPlans;
                            data.site.signed_in = { status: true, guest };
                        }
                        writeJSONFile(paths.site, data.site);
                        res.status(200).json({ message: 'this is a POST Request', success });
                        break;

                    case "signout":
                        clearSignedIn();
                        clearBillPlans();
                        break;

                    case "connect":
                        const { plan_uuid } = req.body;

                        clearBillPlans();
                        const getSelectedPlan = data.bill_plans.filter((billplan: BillPlan) => billplan.uuid === Number(plan_uuid))[0];
                        data.site.connected = {
                            status: true,
                            bill_plan: getSelectedPlan
                        };
                        break;

                    case "disconnect":
                        clearBillPlans();
                        clearSignedIn();
                        clearConnected();
                };

                writeJSONFile(paths.site, data.site);
                if (action !== "signin") res.status(200).json({ message: 'this is a POST Request', site: data.site });
                break;

            default:
                res.end();
                break;
        }
    } catch (error) {
        console.error(`there was an error: ${error}`);
    }
}
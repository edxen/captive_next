import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Site, Guest, Data, Voucher, BillPlan } from '../components/inteface';

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

    const delayDuration = 500;
    setTimeout(() => {
        const setPath = (fileName: string) => path.join(process.cwd(), 'data', `${fileName}.json`);

        const paths: { [key: string]: string; } = {
            pms: setPath('pms'),
            site: setPath('site'),
            bill_plans: setPath('bill_plans'),
            voucher: setPath('voucher'),
        };
        const data = {
            pms: readJSONFile(paths.pms) as Guest[],
            site: readJSONFile(paths.site) as Site,
            bill_plans: readJSONFile(paths.bill_plans) as Site['bill_plans'],
            voucher: readJSONFile(paths.voucher) as Voucher[]
        };

        try {
            let success: boolean = false;
            switch (req.method) {
                case "GET":
                    res.status(200).json({ message: 'this is a GET Request', success: true, site: data.site });
                    break;
                case "POST":
                    const { action } = req.body;

                    const clearBillPlans = () => data.site.bill_plans = [];
                    const clearSignedIn = () => data.site.signed_in = { status: false, guest: {} };
                    const clearConnected = () => data.site.connected = { status: false, bill_plan: {} };

                    switch (action) {
                        case "signin":
                            const { room_number, last_name } = req.body;
                            const guest: Guest = data.pms.filter((data) => data.room_number === room_number)[0];

                            if (guest?.last_name === last_name) success = true;

                            if (success) {
                                const getGuestPlans = data.bill_plans.filter((billPlan) => billPlan.type !== 'voucher');
                                data.site.bill_plans = getGuestPlans;
                                data.site.signed_in = { status: true, guest };
                            }
                            break;

                        case "signout":
                            clearSignedIn();
                            clearBillPlans();

                            success = true;
                            break;

                        case "connect":
                            const { type } = req.body;

                            const getSelectedPlan = (uuid: string) => data.bill_plans.filter((billplan) => billplan.uuid === uuid)[0];

                            switch (type) {
                                case "bill_plan":
                                    const { bill_plan }: { bill_plan: string; } = req.body;

                                    clearBillPlans();

                                    success = true;
                                    data.site.connected = {
                                        status: true,
                                        bill_plan: getSelectedPlan(bill_plan)
                                    };
                                    break;
                                case "access_code":
                                    const { access_code }: { access_code: string; } = req.body;

                                    const found = data.voucher.filter((voucher) => voucher.code === access_code)[0];

                                    if (found) {
                                        success = true;

                                        const associatedPlan: BillPlan = getSelectedPlan(found.uuid);
                                        associatedPlan.code = access_code;
                                        data.site.connected = {
                                            status: true,
                                            bill_plan: associatedPlan
                                        };
                                    }
                                    break;
                            }
                            break;

                        case "disconnect":
                            clearBillPlans();
                            clearSignedIn();
                            clearConnected();

                            success = true;
                    };

                    writeJSONFile(paths.site, data.site);
                    res.status(200).json({ message: 'this is a POST Request', success, site: data.site } as Data);
                    break;

                default:
                    res.end();
                    break;
            }
        } catch (error) {
            console.error(`there was an error: ${error}`);
        }
    }, delayDuration);
}
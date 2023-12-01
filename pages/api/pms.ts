// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const fullPath = path.join(process.cwd(), 'data', 'pms.json');

interface PMSData {
    uuid: number;
    room_number: number;
    full_name: string;
    first_name: string;
    last_name: string;
    code: string;
}

type Data = {
    message: string;
    data?: PMSData;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "GET") {
        try {
            const data = fs.readFileSync(fullPath, 'utf-8');
            const jsonData = JSON.parse(data);
            res.status(200).json({ message: 'this is a GET Request', data: jsonData });
        } catch (error) {
            console.error(`there was an error: ${error}`);
        }
    } else {
        res.end();
    }

}
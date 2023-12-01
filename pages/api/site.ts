// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { Site } from '../components/inteface';

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
            const sitePath = path.join(process.cwd(), 'data', 'site.json');
            const siteRef = fs.readFileSync(sitePath, 'utf-8');
            const siteData = JSON.parse(siteRef);
            siteData.signed_in = {
                status: false,
                guest: {}
            };
            fs.writeFileSync(sitePath, JSON.stringify(siteData, null, 2));
            res.status(200).json({ message: 'this is a POST Request', site: siteData });
        } catch (error) {
            console.error(`there was an error: ${error}`);
        }
    } else {
        res.end();
    }
}
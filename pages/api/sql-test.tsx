import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        res.status(200).json({ data: "HELLO" });
    }
    else if (req.method === "POST") {
        try {
            const payload = req.body;

            console.log(payload);

            res.status(200).json({ status: 'success', data: payload })
        }
        catch (err: any) {
            res.status(500).json({ error: err.message })
        }
    }
}
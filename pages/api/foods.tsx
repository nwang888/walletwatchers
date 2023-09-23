import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        // retrieve data
        try {
            const db = await open({
                filename: './sql/foods.db',
                driver: sqlite3.Database
            });

            await db.run(`
                CREATE TABLE IF NOT EXISTS foods (
                    food TEXT PRIMARY KEY,
                    rating INTEGER
                )
            `);

            const foods = await db.all('SELECT * FROM foods');

            await db.close();

            return res.status(200).json(foods);
        }
        catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }
    else if (req.method === 'POST') {
        try {
            const db = await open({
                filename: './sql/foods.db',
                driver: sqlite3.Database
            });

            await db.run(`
                CREATE TABLE IF NOT EXISTS foods (
                    food TEXT PRIMARY KEY,
                    rating INTEGER
                )
            `);

            const payload = req.body;

            await db.run(`
                INSERT INTO foods (food, rating)
                VALUES (?, ?)
            `, [payload.food, payload.rating]);

            await db.close();

            return res.status(200).json(payload);
        }
        catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }
}
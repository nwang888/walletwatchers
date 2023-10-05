import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export default async function handler(req, res) {

    if (req.method === 'GET') {
        // retrieve data
        try {
            const db = await open({
                filename: './sql/big.db',
                driver: sqlite3.Database
            });


            const payload = await db.all('SELECT * FROM Accounts');

            await db.close();

            return res.status(200).json(payload);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
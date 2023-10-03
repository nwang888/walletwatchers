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

            await db.run(`
                CREATE TABLE IF NOT EXISTS big (
                    balance INTEGER PRIMARY KEY
                )
            `);

            const balance = await db.all('SELECT * FROM big');

            await db.close();

            return res.status(200).json(balance);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    else if (req.method === 'POST') {
        console.log('POSTING');
        try {
            const db = await open({
                filename: './sql/big.db',
                driver: sqlite3.Database
            });

            await db.run(`
                CREATE TABLE IF NOT EXISTS big (
                    balance INTEGER PRIMARY KEY
                )
            `);

            const payload = req.body;

            await db.run(`
                INSERT INTO big (balance)
                VALUES (?)
            `, [payload.balance]);

            await db.close();

            return res.status(200).json(payload);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
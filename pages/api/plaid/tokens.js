import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';

export default async function token_handler(req, res) {

    console.log("IN TOKENDB");

    if (req.method == 'GET') {
        //get the data
        try {
            console.log("GETTING");
            const db  = await open({
                //declare the db
                filename: './sql/tokens.db',
                driver: sqlite3.Database 
            });

            await db.run(`
                CREATE TABLE IF NOT EXISTS bank_token (
                    token_name TEXT PRIMARY KEY,
                    access_token TEXT
                )
            `);
            
            const tokens = await db.all('SELECT access_token FROM bank_token LIMIT 1');

            await db.close();

            //stringify the return

            return res.status(200).json(tokens);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    else if (req.method === 'POST') {
        try {
            console.log("POSTING");
            const db = await open({
                filename: './sql/tokens.db',
                driver: sqlite3.Database
            });

            await db.run(`
                CREATE TABLE IF NOT EXISTS bank_token (
                    token_name TEXT PRIMARY KEY,
                    access_token TEXT
                )
            `);

            const payload = JSON.parse(req.body);

            await db.run(`
                INSERT OR REPLACE INTO bank_token (token_name, access_token)
                VALUES (?, ?)
            `, [payload.token_name, payload.access_token]);

            console.log("tokens payload " + payload);
            console.log("tokens post " + payload.token_name + payload.access_token);

            await db.close();

            return res.status(200).json(payload);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
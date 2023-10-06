import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export default async function handler(req, res) {

    if (req.method === 'GET') {
        // retrieve data
        try {
            const db = await open({
                filename: './sql/wishlists.db',
                driver: sqlite3.Database
            });

            await db.run(`
                CREATE TABLE IF NOT EXISTS Wishlists (
                    wishlist_id INTEGER NOT NULL,
                    item_name VARCHAR(256) NOT NULL,
                    item_price DECIMAL(10,2) NOT NULL,
                    PRIMARY KEY (wishlist_id)
                )
            `);

            const wishlists = await db.all('SELECT * FROM wishlists');
            console.log(wishlists);
            await db.close();

            return res.status(200).json(wishlists);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    else if (req.method === 'POST') {
        console.log("posted!");
        console.log(req.body);
        try {
            const db = await open({
                filename: './sql/wishlists.db',
                driver: sqlite3.Database
            });

            await db.run(`
                CREATE TABLE IF NOT EXISTS Wishlists (
                    wishlist_id INTEGER NOT NULL,
                    item_name VARCHAR(256) NOT NULL,
                    item_price DECIMAL(10,2) NOT NULL,
                    PRIMARY KEY (wishlist_id)
                )
            `);

            const requestData = req.body; // Access data sent in the request body
            res.json({ message: 'Data received successfully', data: requestData });

            console.log(requestData);

            const wishlist_id = Math.floor(Math.random);
            try {

                console.log(requestData.wishlist_id);

            await db.run(`
                INSERT INTO wishlists (wishlist_id, item_name, item_price)
                VALUES (?, ?, ?)
            `, [wishlist_id, requestData.name, requestData.price]);
            console.log("added");
            } catch (error) {
            console.error("Error adding item:", error.message);
            }

            await db.close();
            console.log("aft");

            res.json({ message: 'Table: ', data: requestData });

            return res.status(200).json(payload);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}

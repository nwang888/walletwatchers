import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export default async function handler(req, res) {
    if (req.method === "GET") {
        // retrieve data
        try {
            const db = await open({
                filename: "./sql/big.db",
                driver: sqlite3.Database
            });

            // Get page from query parameters, default to 1 if not provided
            const page = req.query.page ? parseInt(req.query.page) : 1;
            // Set the number of records per page
            const recordsPerPage = 10;
            // Calculate the offset
            const offset = (page - 1) * recordsPerPage;

            // Modify the SQL query to include LIMIT and OFFSET
            const wishlists = await db.all(`SELECT * FROM wishlists LIMIT ? OFFSET ?`, [recordsPerPage, offset]);
            console.log(wishlists);
            // console.log(WishlistPage$remainingBalance);
            await db.close();

            return res.status(200).json(wishlists);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }  else if (req.method === "POST") {
        console.log("posted!");
        console.log(req.body);
        try {
            const db = await open({
                filename: "./sql/big.db",
                driver: sqlite3.Database
            });

            const requestData = req.body; // Access data sent in the request body
            res.json({ message: "Data received successfully", data: requestData });

            console.log(requestData);

            const wishlist_id = Math.floor(Math.random);
            try {
                console.log(requestData.wishlist_id);

                await db.run(
                    `
                INSERT INTO wishlists (wishlist_id, item_name, item_price)
                VALUES (?, ?, ?)
            `,
                    [wishlist_id, requestData.name, requestData.price]
                );
                console.log("added");
            } catch (error) {
                console.error("Error adding item:", error.message);
            }

            await db.close();
            console.log("aft");

            res.json({ message: "Table: ", data: requestData });

            return res.status(200).json(payload);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    if (req.method === "DELETE") {
        console.log("delete");
        const { id } = req.query;

        try {
            const db = await open({
            filename: './sql/big.db',
            driver: sqlite3.Database
            });

            await db.run(
            `
                DELETE FROM wishlists
                WHERE wishlist_id = ?
            `,
            [id]
            );

            await db.close();

            res.status(200).json({ message: `Item with id ${id} deleted.` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

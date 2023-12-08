import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const db = await open({
                filename: "./sql/big.db",
                driver: sqlite3.Database
            });

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const recordsPerPage = 10;
            const offset = (page - 1) * recordsPerPage;

            const wishlists = await db.all(`SELECT * FROM wishlists LIMIT ? OFFSET ?`, [recordsPerPage, offset]);
			console.log(wishlists);
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
    } else if (req.method === "DELETE") {
        console.log("deleted");
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
    } if (req.method === "PUT") {
        console.log("liked");
        const { id } = req.query;
      
        try {
          const db = await open({
            filename: './sql/big.db',
            driver: sqlite3.Database
          });
      
          await db.run('UPDATE wishlist SET liked = 1 WHERE wishlist_id = ?', [id]);
          await db.run('UPDATE wishlist SET liked = 1 ORDER BY liked DESC;')
            await db.close();

            return res.status(200).json(wishlists);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
      

	if (req.method === "SORT") {
        console.log("sort");
        // const { id } = req.query;

        try {
            const db = await open({
            filename: './sql/big.db',
            driver: sqlite3.Database
            });

            await db.run(
            `
			SELECT * FROM wishlists
			ORDER BY ${price}
			LIMIT ? OFFSET ?`, [recordsPerPage, offset]);

            await db.close();

            res.status(200).json({ message: `Item with id ${id} deleted.` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }



	
}
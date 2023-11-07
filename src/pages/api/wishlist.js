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

			const wishlists = await db.all("SELECT * FROM wishlists");
			console.log(wishlists);
			await db.close();

			return res.status(200).json(wishlists);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	} else if (req.method === "POST") {
		console.log(req.body);
		try {
			const db = await open({
				filename: "./sql/big.db",
				driver: sqlite3.Database
			});

			const requestData = req.body; // Access data sent in the request body
			// res.json({ message: "Data received successfully", data: requestData });

			console.log(requestData);

			const lastWishlist = await db.get("SELECT wishlist_id FROM wishlists ORDER BY wishlist_id DESC LIMIT 1");
			const wishlist_id = lastWishlist ? lastWishlist.wishlist_id + 1 : 1;

			try {
				console.log('wishlist id:', wishlist_id);

				await db.run(
					`
                INSERT INTO wishlists (wishlist_id, item_name, item_price)
                VALUES (?, ?, ?)
            `,
					[wishlist_id, requestData.name, requestData.price]
				);
				console.log("wishlist posted to db");
			} catch (error) {
				console.error("Error adding item:", error.message);
			}

			await db.close();
			console.log("posted!");

			// res.json({ message: "Table: ", data: requestData });

			return res.status(200).json(payload);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
}

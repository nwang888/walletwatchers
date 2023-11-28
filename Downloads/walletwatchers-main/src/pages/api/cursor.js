import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function getCursor() {
	const db = await open({
		//declare the db
		filename: "./sql/big.db",
		driver: sqlite3.Database
	});

	let cursor = await db.all(
		"SELECT cursor FROM Transactions ORDER BY Transactions.cursor DESC LIMIT 1"
	);

	// if there is no cursor, set it to null
	if (cursor.length == 0) {
		cursor = null;
	}

	await db.close();

	return cursor;
}

export default async function cursorHandler(req, res) {
	// Handling Get request
	if (req.method == "GET") {
		try {
			const payload = await getCursor();
			return res.status(200).json(payload);
		} catch (error) {
			console.error("Error fetching cursor data:", error);
			return res.status(500).json({ error: "Failed to fetch account data" });
		}
	}
}

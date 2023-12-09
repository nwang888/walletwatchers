import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function getCategory(column) {
	// protect against SQL injection
	if (column !== "category_primary" && column !== "category_detailed") {
		console.log(
			column !== "category_primary" && column !== "category_detailed"
		);
		throw new Error("Invalid column");
	}

	const db = await open({
		filename: "./sql/big.db",
		driver: sqlite3.Database
	});

	const info = await db.all(`
    SELECT DISTINCT ${column} FROM Transactions
  `);

	await db.close();

	return info;
}

export default async function categoryHandler(req, res) {
	// Handling Get request
	if (req.method == "GET") {
		try {
			const column = req.query.column;
			const payload = await getCategory(column);
			if (payload.length == 0) {
				console.log(payload);
				return res
					.status(200)
					.json({ message: "no tuples returned for this column ;-;" });
			} else {
				return res.status(200).json(payload);
			}
		} catch (e) {
			return res.status(500).send("/api/categories is broken");
		}
	}
}

import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function getCategory(column, isMap) {
	const db = await open({
		filename: "./sql/big.db",
		driver: sqlite3.Database
	});

	let info;
	if (isMap === "true") {
		// get a map of category_primary to category_detailed
		const rows = await db.all(`
			SELECT category_primary, GROUP_CONCAT(DISTINCT category_detailed) as category_detailed
			FROM Transactions
			GROUP BY category_primary
		`);

		info = rows.reduce((acc, row) => {
			acc[row.category_primary] = row.category_detailed.split(",");
			return acc;
		}, {});
	} else {
		// protect against SQL injection
		if (column !== "category_primary" && column !== "category_detailed") {
			throw new Error("Invalid column");
		}

		info = await db.all(`
      SELECT DISTINCT ${column} FROM Transactions
    `);
	}

	await db.close();

	return info;
}
export default async function categoryHandler(req, res) {
	// handle get request to categories
	if (req.method == "GET") {
		try {
			const { column, isMap } = req.query;
			const payload = await getCategory(column, isMap);
			if (payload.length == 0) {
				return res.status(200).json({ message: "no tuples returned ;-;" });
			} else {
				return res.status(200).json(payload);
			}
		} catch (e) {
			return res.status(500).send("/api/categories is broken");
		}
	}
}

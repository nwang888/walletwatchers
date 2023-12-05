import sqlite3 from "sqlite3";
import { open } from "sqlite";


async function getSumByCategory() {
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database
    });

    const result = await db.all(`
        SELECT category_primary, SUM(transaction_amount) AS total_amount
        FROM Transactions
        GROUP BY category_primary
    `);

    await db.close();
    return result;
}

export default async function handler(req, res) {
	if (req.method == "GET") {
		try {
			const payload = await getSumByCategory();
			if (payload.length == 0) {
				console.log(payload);
				return res
					.status(200)
					.json({ message: "No Transactions" });
			} else {
				return res.status(200).json(payload);
			}
		} catch (e) {
			return res.status(500).send("its broken");
		}
	}
}
import sqlite3 from "sqlite3";
import { open } from "sqlite";


// open database connection
export async function getHistogram() {
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database,
    });
    const payload = await db.all(`
        SELECT category_primary as category, SUM(transaction_amount) as spending
        FROM Transactions
        GROUP BY category_primary
    `);
    return payload;
}

export default async function histogramHandler(req, res) {
	// handle get request to fetch histogram data
	if (req.method == "GET") {
		try {
            // open database connection
			const payload = await getHistogram();
			if (payload.length == 0) {
				return res.status(200).json({ message: "no tuples returned ;-;" });
			} else {
				return res.status(200).json(payload);
			}
		} catch (e) {
			return res.status(500).send("/api/budget-category is broken");
		}
	}
}
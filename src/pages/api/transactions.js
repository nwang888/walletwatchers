import sqlite3 from "sqlite3";
import { open } from "sqlite";

// create an async function that posts the trasnactions to the database
async function postTransactionsData(
	added,
	modified,
	removed,
	cursor,
	next_cursor
) {
	const db = await open({
		filename: "./sql/big.db",
		driver: sqlite3.Database
	});
	try {
		for (let transaction of added) {
			let {
				transaction_id,
				account_id,
				category: [category_primary, category_detailed],
				merchant_name,
				store_number,
				logo_url,
				amount: transaction_amount,
				location: { address, city, region, postal_code, country },
				datetime,
				payment_channel
			} = transaction;

			await db.run(
				`
                INSERT INTO Transactions (
                    transaction_id,
                    account_id,
                    category_primary,
                    category_detailed,
                    merchant_name,
                    store_number,
                    logo_url,
                    transaction_amount,
                    address,
                    city,
                    region,
                    postal_code,
                    country,
                    datetime,
                    payment_channel,
                    cursor,
                    next_cursor
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
				[
					transaction_id,
					account_id,
					category_primary,
					category_detailed,
					merchant_name,
					store_number,
					logo_url,
					transaction_amount,
					address,
					city,
					region,
					postal_code,
					country,
					datetime,
					payment_channel,
					cursor,
					next_cursor
				]
			);
		}

		for (let transaction of modified) {
			let {
				transaction_id,
				account_id,
				category: [category_primary, category_detailed],
				merchant_name,
				store_number,
				logo_url,
				amount: transaction_amount,
				location: { address, city, region, postal_code, country },
				datetime,
				payment_channel
			} = transaction;

			await db.run(
				`
                UPDATE Transactions
                SET
                    category_primary = ?,
                    category_detailed = ?,
                    merchant_name = ?,
                    store_number = ?,
                    logo_url = ?,
                    transaction_amount = ?,
                    address = ?,
                    city = ?,
                    region = ?,
                    postal_code = ?,
                    country = ?,
                    datetime = ?,
                    payment_channel = ?,
                    next_cursor = ?
                WHERE transaction_id = ?
                `,
				[
					category_primary,
					category_detailed,
					merchant_name,
					store_number,
					logo_url,
					transaction_amount,
					address,
					city,
					region,
					postal_code,
					country,
					datetime,
					payment_channel,
					next_cursor,
					transaction_id
				]
			);
		}

		for (let transaction of removed) {
			let { transaction_id } = transaction;

			await db.run(
				`
                DELETE FROM Transactions
                WHERE transaction_id = ?
                `,
				[transaction_id]
			);
		}
	} catch (e) {
		console.error(e);
	}
	await db.close();
}

// create an async function that gets the transactions from the database
async function getTransactionsData() {
	const db = await open({
		//declare the db
		filename: "./sql/big.db",
		driver: sqlite3.Database
	});

	const payload = await db.all(`
        SELECT * FROM Transactions
    `);

	await db.close();

	return payload;
}

export default async function transaction_handler(req, res) {
	if (req.method === "GET") {
		try {
			const payload = await getTransactionsData();
			return res.status(200).json(payload);
		} catch (error) {
			console.error("Error fetching account data:", error);
			return res.status(500).json({ error: "Failed to fetch account data" });
		}
	}
	if (req.method == "POST") {
		try {
			const { added, modified, removed, cursor } = req.body;
			await postTransactionsData(added, modified, removed, cursor);
			return res.status(200).json({ message: "Posted Transaction Data" });
		} catch (error) {
			console.error(error);
		}
	}
}

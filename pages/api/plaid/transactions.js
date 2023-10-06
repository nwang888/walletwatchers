import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { config, access_token } from "./plaid_variables";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

// create an async function that posts the transactions to the database
async function postTransaction(access_token) {
	// query the database for the latest cursor
	const db = await open({
		//declare the db
		filename: "./sql/big.db",
		driver: sqlite3.Database,
	});

	let cursor = await db.all(
		"SELECT cursor FROM Transactions ORDER BY Transactions.cursor DESC LIMIT 1"
	);

	let hasMore = true;
	// Iterate through each page of new transaction updates for item
	while (hasMore) {
		const transactionResponse = await client.transactionsSync({
			"access_token": access_token,
			"cursor": cursor,
			"client_id": process.env.PLAID_CLIENT_ID,
			"secret": process.env.PLAID_SECRET,
			"count": 500,
		});
		const new_transactions = transactionResponse.data.added;

		for (let transaction of new_transactions) {
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
				payment_channel,
				next_cursor,
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
					next_cursor,
				]
			);
		}

		const modified_transactions = transactionResponse.data.modified;

		for (let transaction of modified_transactions) {
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
				payment_channel,
				next_cursor,
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
					transaction_id,
				]
			);
		}

		const removed_transactions = transactionResponse.data.removed;

		for (let transaction of removed_transactions) {
			let { transaction_id } = transaction;

			await db.run(
				`
                DELETE FROM Transactions
                WHERE transaction_id = ?
                `,
				[transaction_id]
			);
		}

		hasMore = transactionResponse.data.has_more;

		// Update cursor to the next cursor
		cursor = transactionResponse.data.next_cursor;
	}

	await db.close();
}

// create an async function that gets the transactions from the database
async function getTransaction() {
	const db = await open({
		//declare the db
		filename: "./sql/big.db",
		driver: sqlite3.Database,
	});

	const payload = await db.all(`
        SELECT * FROM Transactions
    `);

	await db.close();

	return payload;
}

export default async function transaction_handler(req, res) {
	if (req.method === "GET") {
		if (access_token) {
			try {
				// sync the transactions to the database from Plaid
				postTransaction(access_token);

				// return all transactions in the database
				return res.status(200).json(await getTransaction());
			} catch (error) {
				console.error(error);
			}
		}
	}
}

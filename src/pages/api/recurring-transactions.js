import sqlite3 from "sqlite3";
import { open } from "sqlite";

// create an async function that posts the transaction to the associated account in the database
async function postTransaction(transaction) {
	// open the database
	const db = await open({
		filename: "./sql/big.db",
		driver: sqlite3.Database
	});
	try {
		console.log("Inserting recurring transaction:", transaction);
		await db.run(
			`
      INSERT INTO RecurringTransactions (transaction_id, category_primary, category_detailed, merchant_name, transaction_amount)
      VALUES (?, ?, ?, ?, ?)
      `,
			[
				transaction.transaction_id,
				transaction.primary_category,
				transaction.detailed_category,
				transaction.merchant_name,
				transaction.transaction_amount
			]
		);
	} catch (e) {
		console.log("error inserting recurring transaction:", e);
	}
	// update the transaction for the account
	await db.close();
}

// the async function that gets all of the budget information from the database

async function getTransactions() {
	const db = await open({
		filename: "./sql/big.db",
		driver: sqlite3.Database
	});

	const info = await db.all(`
        SELECT * FROM RecurringTransactions
    `);

	await db.close();

	return info;
}

export default async function TransactionHandler(req, res) {
	// Handling Get request
	if (req.method == "GET") {
		try {
			//this may not be needed
			const payload = await getTransactions();
			if (payload.length == 0) {
				console.log(payload);
				return res
					.status(200)
					.json({ message: "no recurring transactions set" });
			} else {
				return res.status(200).json(payload);
			}
		} catch (e) {
			return res.status(500).send("its broken");
		}
	}
	// Handling POST request
	if (req.method === "POST") {
		const {
			primary_category,
			detailed_category,
			merchant_name,
			transaction_amount
		} = req.body;

		//the id for the recurring transaction
		console.log(req.body);
		const db = await open({
			filename: "./sql/big.db",
			driver: sqlite3.Database
		});
		let transaction_id = await db.get(`
        SELECT MAX(transaction_id) as maxAccountId FROM RecurringTransactions
    `);
		await db.close();

		transaction_id = transaction_id.maxAccountId ?? "0";
        transaction_id = parseInt(transaction_id) + 1;
        console.log("The transaction id is " + transaction_id);

		// Post the recurring transaction to the database
		try {
			postTransaction({
				transaction_id,
				primary_category,
				detailed_category,
				merchant_name,
				transaction_amount
			});
			res
				.status(200)
				.json({ message: "Recurring transaction set successfully!" });
		} catch (error) {
			res.status(500).json({
				message: "Failed to set recurring transaction.",
				error: error.message
			});
		}
	}
}

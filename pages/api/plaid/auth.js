import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { config, access_token } from "./plaid_variables";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

// create an async function that posts the balance to the associated account in the database
async function postAuth(account, number) {
	const db = await open({
		filename: "./sql/big.db",
		driver: sqlite3.Database,
	});

	await db.run(
		`
        INSERT INTO Accounts (account_id, routing_number, account_name, account_subtype, account_balance, account_limit)
        VALUES (?, ?, ?, ?, ?, ?)
    `,
		[
			account.account_id,
			number.routing,
			account.name,
			account.subtype,
			account.balances.current,
			account.balances.limit,
		]
	);

	await db.close();
}

async function getAuth() {
	const db = await open({
		filename: "./sql/big.db",
		driver: sqlite3.Database,
	});

	const payload = await db.all(`
        SELECT * FROM ACCOUNTS
    `);

	await db.close();

	return payload;
}

export default async function auth_handler(req, res) {
	if (req.method === "GET") {
		if (access_token) {
			try {
				// get the auth response
				const authResponse = await client.authGet({
					access_token,
				});

				const accounts = authResponse.data.accounts;
				const numbers = authResponse.data.numbers.ach;

				for (let i = 0; i < accounts.length; i++) {
					const account = accounts[i];
					let number = undefined;

					if (i < numbers.length) number = numbers[i];

					// post each account to the database
					postAuth(account, number);
				}

				// return all accounts in the database
				return res.status(200).json(await getAuth());
			} catch (error) {
				console.error(error);
			}
		}
	}
}

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export default async function handler(req, res) {
	if (req.method === "GET") {
		// retrieve data
		try {
			const db = await open({
				filename: "./sql/big.db",
				driver: sqlite3.Database,
			});

			await db.run(`
                CREATE TABLE IF NOT EXISTS big (
                    balance INTEGER PRIMARY KEY
                );
            
                CREATE TABLE IF NOT EXISTS Accounts (
                    account_id VARCHAR(256) NOT NULL,
                    routing_number INTEGER NOT NULL,
                    account_name VARCHAR(256),
                    account_subtype VARCHAR(256),
                    account_balance DECIMAL(10,2) NOT NULL,
                    account_limit DECIMAL(10,2),
                    PRIMARY KEY (account_id)
                    UNIQUE KEY (routing_number)
                )

                CREATE TABLE IF NOT EXISTS Transactions (
                    transaction_id VARCHAR(256) NOT NULL,
                    account_id VARCHAR(256) NOT NULL,
                    category_id VARCHAR(256),
                    category_name VARCHAR(256),
                    merchant_name VARCHAR(256),
                    store_number INTEGER,
                    transaction_amount DECIMAL(10,2) NOT NULL,
                    address VARCHAR(256),
                    city VARCHAR(256),
                    region VARCHAR(256),
                    postal_code VARCHAR(256),
                    country VARCHAR(256),
                    date VARCHAR(256) NOT NULL,
                    PRIMARY KEY (transaction_id),
                    FOREIGN KEY (account_id) REFERENCES Accounts(account_id)
                )

                CREATE TABLE IF NOT EXISTS Wishlists (
                    wishlist_id INTEGER NOT NULL,
                    item_name VARCHAR(256) NOT NULL,
                    item_price DECIMAL(10,2) NOT NULL,
                    PRIMARY KEY (wishlist_id)
                )

                CREATE TABLE IF NOT EXISTS Budgets (
                    budget_id INTEGER NOT NULL,
                    budget_name VARCHAR(256) NOT NULL,
                    time_window type NOT NULL,
                    PRIMARY KEY (budget_id)
                )

                CREATE TABLE IF NOT EXISTS Categories (
                    category_id INTEGER NOT NULL,
                    category_name VARCHAR(256) NOT NULL,
                    category_budget_percentage DECIMAL(10,2) NOT NULL,
                    PRIMARY KEY (category_id)
                )
            `);

			const balance = await db.all("SELECT * FROM big");

			await db.close();

			return res.status(200).json(balance);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	} else if (req.method === "POST") {
		console.log("POSTING");
		try {
			const db = await open({
				filename: "./sql/big.db",
				driver: sqlite3.Database,
			});

			await db.run(`
                CREATE TABLE IF NOT EXISTS big (
                    balance INTEGER PRIMARY KEY
                )

                CREATE TABLE IF NOT EXISTS big (
                    balance INTEGER PRIMARY KEY
                );
            
                CREATE TABLE IF NOT EXISTS Accounts (
                    account_id VARCHAR(256) NOT NULL,
                    routing_number INTEGER NOT NULL,
                    account_name VARCHAR(256),
                    account_subtype VARCHAR(256),
                    account_balance DECIMAL(10,2) NOT NULL,
                    account_limit DECIMAL(10,2),
                    PRIMARY KEY (account_id)
                    UNIQUE KEY (routing_number)
                )

                CREATE TABLE IF NOT EXISTS Transactions (
                    transaction_id VARCHAR(256) NOT NULL,
                    account_id VARCHAR(256) NOT NULL,
                    category_id VARCHAR(256),
                    category_name VARCHAR(256),
                    merchant_name VARCHAR(256),
                    store_number INTEGER,
                    transaction_amount DECIMAL(10,2) NOT NULL,
                    address VARCHAR(256),
                    city VARCHAR(256),
                    region VARCHAR(256),
                    postal_code VARCHAR(256),
                    country VARCHAR(256),
                    date VARCHAR(256) NOT NULL,
                    PRIMARY KEY (transaction_id),
                    FOREIGN KEY (account_id) REFERENCES Accounts(account_id)
                )

                CREATE TABLE IF NOT EXISTS Wishlists (
                    wishlist_id INTEGER NOT NULL,
                    item_name VARCHAR(256) NOT NULL,
                    item_price DECIMAL(10,2) NOT NULL,
                    PRIMARY KEY (wishlist_id)
                )

                CREATE TABLE IF NOT EXISTS Budgets (
                    budget_id INTEGER NOT NULL,
                    budget_name VARCHAR(256) NOT NULL,
                    time_window type NOT NULL,
                    PRIMARY KEY (budget_id)
                )

                CREATE TABLE IF NOT EXISTS Categories (
                    category_id INTEGER NOT NULL,
                    category_name VARCHAR(256) NOT NULL,
                    category_budget_percentage DECIMAL(10,2) NOT NULL,
                    PRIMARY KEY (category_id)
                )
            `);

			const payload = req.body;

			await db.run(
				`
                INSERT INTO big (balance)
                VALUES (?)
            `,
				[payload.balance]
			);

			await db.close();

			return res.status(200).json(payload);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
}

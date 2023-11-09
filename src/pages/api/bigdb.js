import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export default async function instantiateBigDB(req, res) {
	// retrieve data
	try {
		console.log("opening db");
		const db = await open({
			filename: "./sql/big.db",
			driver: sqlite3.Database
		});

		console.log("opened db");

		await db.run(`
            CREATE TABLE IF NOT EXISTS Accounts (
                account_id VARCHAR(256) NOT NULL,
                routing_number INTEGER NOT NULL,
                account_name VARCHAR(256),
                account_subtype VARCHAR(256),
                account_balance DECIMAL(10,2) NOT NULL,
                account_limit DECIMAL(10,2),
                PRIMARY KEY (account_id)
            );
        `);

		await db.run(`
            CREATE TABLE IF NOT EXISTS Transactions (
                transaction_id VARCHAR(256) NOT NULL,
                account_id VARCHAR(256) NOT NULL,
                account_name VARCHAR(256) NOT NULL,
                category_primary VARCHAR(256),
                category_detailed VARCHAR(256),
                merchant_name VARCHAR(256),
                store_number INTEGER,
                logo_url VARCHAR(256),
                transaction_amount DECIMAL(10,2) NOT NULL,
                address VARCHAR(256),
                city VARCHAR(256),
                region VARCHAR(256),
                postal_code VARCHAR(256),
                country VARCHAR(256),
                datetime DATETIME,
                payment_channel VARCHAR(16),
                cursor VARCHAR(256),
                next_cursor VARCHAR(256),
                FOREIGN KEY (account_id) REFERENCES Accounts(account_id),
            );
        `);

		await db.run(`
            CREATE TABLE IF NOT EXISTS CategoryDescription (
                category_primary VARCHAR(256) NOT NULL,
                category_detailed VARCHAR(256) NOT NULL,
                category_description VARCHAR(256) NOT NULL,
                PRIMARY KEY (category_detailed)
            );
        `);

		await db.run(`
            CREATE TABLE IF NOT EXISTS Wishlists (
                wishlist_id INTEGER NOT NULL,
                item_name VARCHAR(256) NOT NULL,
                item_price DECIMAL(10,2) NOT NULL,
                PRIMARY KEY (wishlist_id)
            );
        `);

		await db.run(`
            CREATE TABLE IF NOT EXISTS Budgets (
                budget_id INTEGER NOT NULL,
                budget_name VARCHAR(256) NOT NULL,
                start_date DATETIME NOT NULL,
                end_date DATETIME NOT NULL,
                budget_amount INTEGER NOT NULL,
                PRIMARY KEY (budget_id)
            );
        `);

		await db.run(`
            CREATE TABLE IF NOT EXISTS BudgetCategories (
                category_id INTEGER NOT NULL,
                category_name VARCHAR(256) NOT NULL,
                category_budget_percentage DECIMAL(10,2) NOT NULL,
                PRIMARY KEY (category_id)
            );
            
        `);

		await db.close();

		return res.status(200).json({ message: "Databases created" });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

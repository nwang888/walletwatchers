import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export default async function handler(req, res) {
	try {
		const db = await open({
			filename: "./sql/utils.db",
			driver: sqlite3.Database,
		});

		await db.run(`
                CREATE TABLE IF NOT EXISTS CategoryDescription (
                    category_primary VARCHAR(256) NOT NULL,
                    category_detailed VARCHAR(256) NOT NULL,
                    category_description VARCHAR(256) NOT NULL,
                    PRIMARY KEY (category_detailed)
                )
            `);

		await db.close();

		return res.status(200);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

import sqlite3 from "sqlite3";
import { open } from "sqlite";

//DEBUG INFO: i think location and datetime details do not exist in the Plaid Sandbox Data
//TODO: Fix potential sql injection on where clause

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

			// Fetch account_name from Accounts table
			const account = await db.get(
				`SELECT account_name FROM Accounts WHERE account_id = ?`,
				account_id
			);
			const account_name = account ? account.account_name : null;
			// console.log("account_name: ", account_name);

			await db.run(
				`
                INSERT INTO Transactions (
					transaction_id,
					account_id,
					account_name,
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
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				`,
				[
					transaction_id,
					account_id,
					account_name,
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
					transaction_id // this might be wrong
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

async function getTransactionsData(
	sort_by = "datetime",
	order = "desc",
	page = 1,
	rowsPerPage = 10,
	paginate = true,
	filters = {}
) {
	const db = await open({
		filename: "./sql/big.db",
		driver: sqlite3.Database
	});

	// Validate sort_by and order
	const validColumns = [
		"account_id",
		"account_name",
		"category_primary",
		"category_detailed",
		"merchant_name",
		"transaction_amount",
		"city",
		"region",
		"datetime"
	];
	const validDirections = ["asc", "desc"];
	if (!validColumns.includes(sort_by) || !validDirections.includes(order)) {
		throw new Error("Invalid sort_by or order", sort_by, order);
	}

	const filters_parsed = JSON.parse(decodeURIComponent(filters));

	console.log("filters: ", filters_parsed);
	let whereClause = "";
	let whereValues = [];
	for (const [key, value] of Object.entries(filters_parsed)) {
		if (value && validColumns.includes(key)) {
			if (Array.isArray(value)) {
				const subclauses = value.map((_, i) => `${key} = ?`).join(" OR ");
				whereClause += ` AND (${subclauses})`;
				whereValues.push(...value);
			} else {
				whereClause += ` AND ${key} = ?`;
				whereValues.push(value);
			}
		} else {
			console.error(`Invalid filter key: ${key}`);
		}
	}
	console.log("whereClause: ", whereClause);
	console.log("whereValues: ", whereValues);

	let payload;
	const totalRows = await db.get(
		`SELECT COUNT(*) as count
		FROM Transactions
		WHERE 1=1 ${whereClause}`,
		whereValues
	);

	if (paginate) {
		const offset = (page - 1) * rowsPerPage;
		payload = await db.all(
			`SELECT * FROM Transactions
			WHERE 1=1 ${whereClause}
			ORDER BY ${sort_by} ${order}, datetime DESC
			LIMIT ? OFFSET ?`,
			[...whereValues, rowsPerPage, offset]
		);
	} else {
		payload = await db.all(
			`SELECT * FROM Transactions
			WHERE 1=1 ${whereClause}
			ORDER BY ${sort_by} ${order}, datetime DESC`,
			whereValues
		);
	}

	await db.close();

	return { transactions: payload, totalRows: totalRows.count };
}

export default async function transaction_handler(req, res) {
	if (req.method === "GET") {
		try {
			const { sort_by, order, page, rowsPerPage, paginate, filters } =
				req.query;
			const payload = await getTransactionsData(
				sort_by,
				order,
				page,
				rowsPerPage,
				paginate,
				filters
			);
			return res.status(200).json(payload);
		} catch (error) {
			console.error("Error fetching transaction data:", error);
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

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

async function getWishlistData(
    sort_by = "wishlist_id",
    order = "ASC",
    page = 1,
    rowsPerPage = 10,
    paginate = true
) { 
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database
    });

    const validColumns = [
        "wishlist_id",
        "item_name",
        "item_price"
    ];
    if (!validColumns.includes(sort_by)) {
		console.log("Invalid sort_by");
        console.log(sort_by);
	}

    let wishlists;
    const totalRows = await db.get(
		`SELECT COUNT(*) as count
		FROM Wishlists`
	)

    if (paginate){
        const offset = (page - 1) * rowsPerPage;
        wishlists = await db.all(`SELECT * FROM Wishlists 
                                    ORDER BY wishlist_id ${order}
                                    LIMIT ? OFFSET ?`, 
                                    [rowsPerPage, offset]);
    } else {
        wishlists = await db.all(`SELECT * FROM Wishlists 
                                         ORDER BY ${sort_by} ${order}
                                        `);
    }

    await db.close();
    console.log(wishlists);
    console.log(totalRows);

    return {wishlists: wishlists, totalRows: totalRows.count};
}

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { sort_by, order, page, rowsPerPage, paginate} = req.query;

            const db = await getWishlistData({
                sort_by,
                order,
                page,
                rowsPerPage,
                paginate
            });
            return res.status(200).json(db);
        } catch (err) {
            return res.status(500).json({error: "Error fetching wishlists data" });
        }
    }  else if (req.method === "POST") {
        console.log("posting!");
        console.log(req.body);
        try {
            const db = await open({
                filename: "./sql/big.db",
                driver: sqlite3.Database
            });

            const requestData = req.body; // Access data sent in the request body
            // res.json({ message: "Data received successfully", data: requestData });

            console.log(requestData);

            const wishlist_id = Math.floor(Math.random);
            console.log(requestData.wishlist_id);

            await db.run(
                `
                INSERT INTO Wishlists (wishlist_id, item_name, item_price)
                VALUES (?, ?, ?)
                `,
                    [wishlist_id, requestData.name, requestData.price]
            );
            console.log("added");

            await db.close();

            res.json({ message: "Table: ", data: requestData });

            return res.status(200).json(payload);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    } else if (req.method === "DELETE") {
        console.log("deleted");
        const { id } = req.query;

        try {
            const db = await open({
            filename: './sql/big.db',
            driver: sqlite3.Database
            });

            await db.run(
            `
                DELETE FROM wishlists
                WHERE wishlist_id = ?
            `,
            [id]
            );

            await db.close();

            res.status(200).json({ message: `Item with id ${id} deleted.` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } if (req.method === "PUT") {
        console.log("liked");
        const { id } = req.query;
      
        try {
          const db = await open({
            filename: './sql/big.db',
            driver: sqlite3.Database
          });
      
          await db.run('UPDATE wishlist SET liked = 1 WHERE wishlist_id = ?', [id]);
          await db.close();

          return res.status(200).json(wishlists);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
	  if (req.method === "HEAD") {
        try {
            const db = await open({
                filename: "./sql/big.db",
                driver: sqlite3.Database
            });

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const recordsPerPage = 10;
            const offset = (page - 1) * recordsPerPage;

            const wishlists = await db.all(`SELECT * FROM wishlists ORDER BY liked DESC LIMIT ? OFFSET ?`, [recordsPerPage, offset]);
			console.log(wishlists);
            await db.close();

            return res.status(200).json(wishlists);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
	}
}
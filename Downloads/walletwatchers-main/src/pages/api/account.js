import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// create an async function that posts the budget to the associated account in the database
async function postAccountData(account, number){
  const db = await open({
      filename: "./sql/big.db",
      driver: sqlite3.Database,
  });
  try{

    // console.log("Inserting or updating account:", account);
    // Check if the account already exists
    const existingAccount = await db.get('SELECT * FROM Accounts WHERE account_id = ?', account.account_id);
    if (existingAccount) {
      // If the account exists, update it
      // console.log("updating accoun: ", account);
      await db.run(
        `UPDATE Accounts SET routing_number = ?, account_name = ?, account_subtype = ?, account_balance = ?, account_limit = ? WHERE account_id = ?`, 
        [number.routing, account.name, account.subtype, account.balances.current, account.balances.limit, account.account_id]
      );
    } else {
      // If the account doesn't exist, insert it
      // console.log("adding account: ", account);
      await db.run(
        `INSERT INTO Accounts (account_id, routing_number, account_name, account_subtype, account_balance, account_limit)
        VALUES (?, ?, ?, ?, ?, ?)`, 
        [account.account_id, number.routing, account.name, account.subtype, account.balances.current, account.balances.limit]
      );
    }
  }
  catch(e){
    console.log("error inserting or updating account:", e);
  }
  await db.close();
}

// the async function that gets all of the budget information from the database

async function getAccountData(){
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database,
    });

    const info = await db.all(`
        SELECT * FROM Accounts
    `);

    await db.close();

    return info;
}

export  async function handler(req, res) {
  if (req.method === "GET") {
      try {
          const db = await open({
              filename: "./sql/big.db",
              driver: sqlite3.Database
          });

          const accountBalance = await db.get("SELECT account_balance FROM Accounts");
          console.log(accountBalance);
          await db.close();

          return res.status(200).json(accountBalance);
      } catch (err) {
          return res.status(500).json({ error: err.message });
      }
  }
}

export default async function accountHandler(req, res) {
  // Handling Get request
  if (req.method == "GET") {
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database
    });

    const totalBalance = await db.get("SELECT SUM(account_balance) as total FROM Accounts");
    await db.close();
    
    try {
      const payload = await getAccountData();
      return res.status(200).json(payload);
    } catch (error) {
      console.error('Error fetching account data:', error);
      return res.status(500).json({ error: 'Failed to fetch account data' });
    }
  }
  // Handling POST request
  if (req.method === "POST") {
      const {accounts, numbers} = req.body;
    

      
      for (var i = 0; i < accounts.length; i++) {
        // console.log(accounts[i]);
        // console.log(numbers[i]);
        const account = accounts[i];
        const number = numbers[i];
        await postAccountData(account, number);
      }
      return res.status(200).json({message: "Posted account information!"});
  }
}


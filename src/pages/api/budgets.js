import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// create an async function that posts the budget to the associated account in the database
async function postBudget(budget){
    // open the database
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database,
    });
    try{
      console.log("Inserting budget:", budget);
      await db.run(`
      INSERT INTO Budgets (budget_id, budget_name, start_date, end_date, budget_amount)
      VALUES (?, ?, ?, ?, ?)
      `,[budget.budget_id, budget.budget_name, budget.start_date, budget.end_date, budget.budget_amount]);
    }
    catch(e){
      console.log("error inserting budget:", e);
    }
    // update the budget for the account
    await db.close();
}

// the async function that gets all of the budget information from the database

async function getBudget(){
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database,
    });

    const info = await db.all(`
        SELECT * FROM Budgets
    `);

    await db.close();

    return info;
}



export default async function budgetHandler(req, res) {
  // Handling Get request
  if (req.method == "GET") {
    try{
      //this may not be needed
      const payload = await getBudget();
      if(payload.length == 0){
        console.log(payload);
        return res.status(200).json({message: "no budget set"});
      }
      else{
        return res.status(200).json(payload);
      }
    }
    catch(e){
      return res.status(500).send("its broken")
    }
  }
  // Handling POST request
  if (req.method === "POST") {
      const {budget_name, start_date, end_date, budget_amount} = req.body;
      
      //the id for the budget
      console.log(req.body);
      const budget_id = Math.floor(Math.random);

      // Post the budget to the database
      try {
          postBudget({ budget_id, budget_name, start_date, end_date, budget_amount});
          res.status(200).json({ message: "Budget set successfully!" });
      } catch (error) {
          res.status(500).json({ message: "Failed to set budget.", error: error.message });
      }
  }
}


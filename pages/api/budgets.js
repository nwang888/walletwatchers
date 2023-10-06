
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { config, access_token } from "./plaid/plaid_variables";
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';




// create an async function that posts the budget to the assiociated account in the database
async function PostBudget(budget){
    // open the database
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database,
    });
    try{
      console.log("Inserting budget:", budget);
      await db.run(`
      INSERT INTO Budgets (budget_id, budget_name, start_date, end_date, budget_ammount)
      VALUES (?, ?, ?)
      `,[budget.budget_id, budget.budget_name, budget.start_date, budget.end_date, budget.budget_ammount]);
    }
    catch(e){
      console.log("error inserting budget:", e);
    }
    // update the budget for the account
    await db.close();
}

// the async function that gets all of the budget informatoin from the database

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



export default async function budget_handler(req, res) {
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
      const {budget_name, start_date, end_date, budget_ammount} = req.body;
      
      //the id for the budget
      const budget_id = Math.floor(Math.random);

      // Post the budget to the database
      try {
          PostBudget({ budget_id, budget_name, start_date, end_date, budget_ammount});
          res.status(200).json({ message: "Budget set successfully!" });
      } catch (error) {
          res.status(500).json({ message: "Failed to set budget.", error: error.message });
      }
  }
}



//need a way to get the current numbers from the database
//need a way to set the budget, and ask for a number 
//need a way to return a flag if the budget is exceeded(to the front end)
//display budget if we are in range


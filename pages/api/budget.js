import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { config, access_token } from "./plaid/plaid_variables";
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

// create an async function that posts the budget to the assiociated account in the database
async function PostBudget(account, budget){
    // open the database
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database,
    });
    // update the budget for the account
    await db.run(`
        INSERT INTO Budget (budget_id, budget_name, time_window)
        VALUES (?, ?, ?)
    `[budget.budget_id, budget.budget_name, budget.time_window]);
    await db.close();
    return "this worked";
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
// export default async function budget_test(req,res){
//   if (req.method == "POST"){
//     if (access_token){
//       //try adding in an account, and a budget value
//       try{
//         const account = "jim";
//         const budget = "4";
        
//         const postres = await PostBudget(account, budget);
//         res.status(200).send(postres);
        
//         const getres = await getBudget();
//         res.status(200).send(getres);
        
//       }
//       catch(e){
//         res.status(500).send("did not work");
//       }
//     }
//   }
// }


export default async function budget_handler(req, res){
  //define the route
  if (req.method == "GET"){
    if (access_token) {
      //check to see if budget is empty
      try{
        const budgetResponse = await getBudget();
        //if the budget is not empty 
        if (budgetResponse.length > 0){
          

        }
        else{
          res.status(200).send("Budget is empty");
        }
      }
      catch(e){
        console.log(e);
        res.status(500).send("did not work");
      }
    }


  }
}

//need a way to get the current numbers from the database
//need a way to set the budget, and ask for a number 
//need a way to return a flag if the budget is exceeded(to the front end)
//display budget if we are in range


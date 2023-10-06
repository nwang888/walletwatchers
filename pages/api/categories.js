import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// create an async function that posts the budget to the assiociated account in the database
async function post_Budget_Categoy(category){
    // open the database
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database,
    });
    try{
      console.log("Inserting category:", category);
      await db.run(`
      INSERT INTO BudgetCategories (category_id, category_name, category_budget_percentage)
      VALUES (?, ?, ?)
      `,[category.category_id, category.category_name, category.category_budget_percentage]);
    }
    catch(e){
      console.log("error inserting category:", e);
    }
    // update the category for the account
    await db.close();
}

// the async function that gets all of the budget informatoin from the database

async function getBudget_Category(){
    const db = await open({
        filename: "./sql/big.db",
        driver: sqlite3.Database,
    });

    const info = await db.all(`
        SELECT * FROM BudgetCategories
    `);

    await db.close();

    return info;
}



export default async function budget_Category_handler(req, res) {
  // Handling Get request
  if (req.method == "GET") {
    try{
      //this may not be needed
      const payload = await getBudget_Category();
      console.log(payload);
      if(payload.length == 0){
        console.log(payload);
        return res.status(200).json({message: "no category set"});
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
      const {category_name, category_budget_percentage } = req.body;
      
      //the id for the budget
      const category_id = Math.floor(Math.random);

      // Post the budget to the database
      try {
          post_Budget_Categoy({ category_id, category_name, category_budget_percentage});
          res.status(200).json({ message: "Category set successfully!" });
      } catch (error) {
          res.status(500).json({ message: "Failed to set Category.", error: error.message });
      }
  }
}



//need a way to get the current numbers from the database
//need a way to set the budget, and ask for a number 
//need a way to return a flag if the budget is exceeded(to the front end)
//display budget if we are in range


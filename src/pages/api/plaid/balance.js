import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { config, access_token } from "./plaid_variables";

import token_handler from "./tokens";

//to be moved
//the value of the token 
const token = access_token;

//firstime login
if (token == null){
	//run the flow(does this work :(((??????
	try {
		const response = await fetch("http://localhost:3000/api/plaid/tokens");
		const token_res = await response.json();
		access_token = token_res[0].access_token;
	  } catch (error) {
		console.error(error);
	  }
}

// Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

// create an async function that posts the balance to the associated account in the database
async function postBalance(account) {
    const account_id = account.account_id;
    const account_subtype = account.subtype;
    const account_name = account.name;
    
}

export default async function balance_handler(req, res) {
	if (req.method === "GET") {

		if (access_token) {
			try {
				const balanceResponse = await client.accountsBalanceGet({
					access_token,
				});

				res.json({
					Balance: balanceResponse.data,
				});
                
			} catch (error) {
				console.error(error);
			}
		}
	}
}
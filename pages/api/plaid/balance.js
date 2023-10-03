import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import config from './plaid_variables';

import token_handler from './tokens';

// Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

export default async function balance_handler(req, res) {
    // Get auth token from tokens.db, this is backend-backend
    if (req.method === 'GET') {
        const token_res = token_handler(req ,res);

        console.log("RETRIEVEAL OF TOKEN");

        const access_token = token_res.data.access_token;

        const balanceResponse = await client.accountsBalanceGet({ access_token });
        res.json({
            Balance: balanceResponse.data,
        });
    }
    
    // Get balance data from Plaid
    // Send balance data from Plaid into Big.db
}

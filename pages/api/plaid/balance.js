import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import config from './plaid_variables';

import token_handler from './tokens';

// Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

export default async function balance_handler(req, res) {
    if (req.method === 'GET') {
        let access_token = null;

        try {
            const response = await fetch('http://localhost:3000/api/plaid/tokens');
            const token_res = await response.json();
            access_token = token_res[0].access_token;
        } catch (error) {
            console.error(error);
        }

        if (access_token) {
            try {
                const balanceResponse = await client.accountsBalanceGet({ access_token });
                res.json({
                    Balance: balanceResponse.data,
                });
            } catch (error) {
                console.error(error);
            }
        }
    }
}
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { config, access_token } from "./plaid_variables";

// Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const tokenResponse = await client.linkTokenCreate({
            user: { client_user_id: process.env.PLAID_CLIENT_ID },
            client_name: "WalletWatchers",
            language: "en",
            products: ["auth"],
            country_codes: ["US"],
            redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
        });

        res.json(tokenResponse.data);
    }
}
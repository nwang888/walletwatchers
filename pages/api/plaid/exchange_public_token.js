import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import config from './plaid_variables';

import token_handler from './tokens';

// Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const exchangeResponse = await client.itemPublicTokenExchange({
            public_token: req.body.public_token,
        });

        // prepare access token to be stored in db
        const dataToSend = {
            token_name: 'access_token',
            access_token: exchangeResponse.data.access_token
        };

        console.log("data to be sent: " + dataToSend.token_name + dataToSend.access_token);

        // send access token to db
        req.method = 'POST';
        req.body = JSON.stringify(dataToSend);

        const token_res = token_handler(req,res);
        console.log("TOKEN RESPONSE" + token_res);

        // Make a POST request to localhost:3000/api/token
        // const token_res = await fetch('http://localhost:3000/api/token', {
        //     method: 'POST',
        //     headers: {
        //     'Content-Type': 'application/json',
        //     // Add any other headers if needed
        //     },
        //     body: JSON.stringify(dataToSend),
        // });
        console.log("TOKEN RESPONSE" + token_res);
        

        // prints response from plaid exchange
        const data = await res.json();
        console.log('Response (from client):', data);
        res.json(true);
    }
}
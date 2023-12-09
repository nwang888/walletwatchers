import { plaidClient } from '../../lib/plaid';

export default async function handler(req, res) {
  // Create a link token with configs which we can then use to initialize Plaid Link in
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { client_user_id: process.env.PLAID_CLIENT_ID },
    client_name: "WalletWatchers",
    language: 'en',
    products: ['auth'],
    country_codes: ['US'],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  });

  return res.json(tokenResponse.data);
}

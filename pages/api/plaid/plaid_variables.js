import { Configuration, PlaidEnvironments } from "plaid";

let config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

let access_token = null;

try {
  const response = await fetch("http://localhost:3000/api/plaid/tokens");
  const token_res = await response.json();
  access_token = token_res[0].access_token;
} catch (error) {
  console.error(error);
}

export { config, access_token };
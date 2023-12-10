# WalletWatchers

## Watching your financial weight

WalletWatchers is an application that allows you to view their financial information across multiple financial institutions. Connect their various accounts, view all of their transactions, filter and sort those transactions in multiple ways, set budgets for various transaction categories, and curate a wishlist of items to spend their savings on.

WalletWatchers is entirely locally hosted, which means that the database is being stored locally on your computer. Aggregation is done through Plaid and the front-end is deployed as a webapp on next.js

## Getting started

Aggregation of financial data and authentication into financial institutions is being handled by Plaid.
As such, you must have a Plaid development/production account.

Make a copy of `.env.example` and rename it to `.env`.
In `.env`, enter your `PLAID_CLIENT_ID`, `PLAID_SECRET`, and `PLAID_ENV`.

In your terminal,

```
npm install
npm run dev
```

Navigate to localhost:3000 in your browser to view.

The db is accessible via `walletwatchers/sql/big.db`

## Using Test Data

Ensure that you have a python environment with the faker package installed,
and that your database is instantiated.

To instantiate your database, `npm run dev` and go through the authentication process once.

In your terminal,

```
cd walletwatchers/utils
python gen.py --a <number of accounts> --t <number of transactions>
```

This will generate as many fake transactions as needed.

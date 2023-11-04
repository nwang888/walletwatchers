import { withIronSessionSsr } from 'iron-session/next';
import { plaidClient, sessionOptions } from '../lib/plaid';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import HomePage from './components/home-page';
import TransactionsPage from './components/transactions-page';
import WishlistPage from './components/wishlist-page';


export default function Dashboard({ balance }) {

  return (
    <>
      <TransactionsPage />
    </>
  )
}

const postAccountData = async (accounts, numbers, req) => {
  const dataToSend = {
    accounts: accounts,
    numbers: numbers.ach
  };

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

  const res = await fetch(`${baseUrl}/api/account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  });

  const data = await res.json();
  console.log('Response (from client):', data);
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

    // initalizes bigdb on login
    const initialize_bigdb = await fetch(`${baseUrl}/api/bigdb`);


    const access_token = req.session.access_token;


    console.log("started");

    if (!access_token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const accountBalance = await plaidClient.authGet({ access_token });

    await postAccountData(accountBalance.data.accounts, accountBalance.data.numbers, req);

    return {
      props: {
        balance: accountBalance.data,
      },
    };
  },
  sessionOptions
);

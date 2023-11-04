import { withIronSessionSsr } from 'iron-session/next';
import { plaidClient, sessionOptions } from '../lib/plaid';
import { useEffect, useState } from 'react';


export default function Dashboard({ balance }) {

  const [accountData, setAccountData] = useState([]);

  useEffect(() => {

    console.log("testing for useEffect");
    
    const getData = async () => {
      const response = await fetch('/api/account');
      const payload = await response.json();
      setAccountData(payload);
    }

    getData();

    console.log("accountData: ", accountData);


  }, []);

  return (
    <>
      {
        // use the data to displays tnayotufn
        accountData.map((account) => {
          return (
            <div key={account.account_id}>
              <h1>{account.name}</h1>
              <h2>{account.balance}</h2>
            </div>
          )
        })
      }
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
  console.log('Response (from data posting):', data);
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
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

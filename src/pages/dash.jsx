import { withIronSessionSsr } from 'iron-session/next';
import { plaidClient, sessionOptions } from '../lib/plaid';
import { useEffect, useState } from 'react';


export default function Dashboard({ balance }) {

  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/api/account');
      const payload = await response.json();
      setAccountData(payload);
      setIsLoading(false);
    }

    getData();
  }, []);

  if (isLoading) {
    return <div>Fetching Data from Plaid...</div>;
  }

  return (
    <>
      <h1>Dashboard</h1>
      {
        accountData.map((account, index) => {
          return (
            <div key={index}>
              <h2>{account.account_name}</h2>
              <h3>{account.account_balance}</h3>
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
  console.log('Response (from client):', data);
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

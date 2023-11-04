import { useEffect, useState } from 'react';


export default function HomePage({ balance }) {

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
      <h1 className='underline'>Home</h1>
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
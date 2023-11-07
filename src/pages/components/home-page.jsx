import { useEffect, useState } from 'react';

import Wallet from './homepage/wallet';


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
    return <div>Fetching Data from DB...</div>;
  }

  return (
    <>
      <h1 className='underline'>Home</h1>

      <div className="flex">

        <div className="w-2/3">
          <h1>Wallets</h1>


          <div className="flex flex-wrap">
            {
              accountData.map((account, index) => {
                if (index < 3)
                return (
                  <Wallet wallet={account} key={index} />
                )

                return null;
              })
            }
          </div>


        </div>
        <div className="w-1/3">
          <h1>Budget</h1>

          <p>insert budget chart here</p>
        </div>

      </div>
    </>
  )
}
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Wallet from './homepage/wallet';


export default function HomePage({ balance }) {

  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

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


      <div className="flex my-5">
        <div className="w-2/3 mr-5">
          <h1 className="text-xl">Wallets</h1>

          <motion.div 
            className="flex flex-wrap"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {
              accountData.map((account, index) => {
                return index < 3 ? (
                  <Wallet wallet={account} key={index} />
                ) : null;
              })
            }
          </motion.div>

          <h2 className="text-right text-md font-bold">View More...</h2>


        </div>
        <div className="w-1/3">
          <h1 className="text-xl">Budget</h1>

          <p>insert budget chart here</p>
        </div>
      </div>


      <div className="flex">
        <div className="w-2/3 mr-5">
          <h1 className="text-xl">Transactions</h1>

          <p>insert transactions here</p>


        </div>
        <div className="w-1/3">
          <h1 className="text-xl">Placeholder</h1>

          <p>insert something here</p>
        </div>
      </div>
    </>
  )
}
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Wallet from './homepage/wallet';


export default function HomePage({ balance }) {

  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
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
      <h1 className='underline'>Home</h1>

      <div className="flex">

        <div className="w-2/3">
          <h1 className="text-xl">Wallets</h1>


          <motion.div 
            className="flex flex-wrap"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {
              accountData.map((account, index) => {
                if (index < 3)
                return (
                  <Wallet 
                    wallet={account} key={index} 
                  />
                )

                return null;
              })
            }
          </motion.div>


        </div>
        <div className="w-1/3">
          <h1>Budget</h1>

          <p>insert budget chart here</p>
        </div>

      </div>
    </>
  )
}
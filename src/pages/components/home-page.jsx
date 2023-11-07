import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Wallet from './homepage/wallet';


export default function HomePage({ setPageNum, setWalletId }) {

  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: { duration: 3}
  };

  const item = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
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

      <button onClick={() => setWalletId("hello")}>
        Tywftah
      </button>


      <div className="flex my-5">
        <div className="w-2/3 mr-5 p-3  bg-slate-50 rounded-md">
          <h1 className="text-xl">Wallets</h1>

          <motion.div 
            className="flex flex-wrap"
            variants={container}
            initial="hidden"
            animate="visible"
          >

            {
              accountData.slice(0, 3).map((account, index) => (
                <button className="text-left w-1/3 p-1" onClick={() => {setPageNum(1); setWalletId(account.account_id);}}>
                  <motion.div 
                    key={index} 
                    variants={item}
                  >
                    <Wallet wallet={account} />
                  </motion.div>
                </button>
              ))
            }

            <AnimatePresence>
              {
                viewAll && accountData.slice(3).map((account, index) => (
                  <button className="text-left w-1/3 p-1" onClick={() => {setPageNum(1); setWalletId(account.account_id);}}>
                    <motion.div 
                      key={index + 3} 
                      variants={item}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <Wallet wallet={account} />
                    </motion.div>
                  </button>
                ))
              }
            </AnimatePresence>
          </motion.div>
            
          <div className="flex justify-end mt-3">
            {
              viewAll ? (
                <button
                  className="text-center text-md font-bold"
                  onClick={() => setViewAll(false)}
                >
                  View Less...
                </button>
              ) : (
                <button
                  className="text-center text-md font-bold"
                  onClick={() => setViewAll(true)}
                >
                  View All...
                </button>
              )
            }
          </div>


        </div>
        <div className="w-1/3 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Budget</h1>

          <p>insert budget chart here</p>
        </div>
      </div>


      <div className="flex">
        <div className="w-2/3 mr-5 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Transactions</h1>

          <p>insert transactions here</p>


        </div>
        <div className="w-1/3 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Placeholder</h1>

          <p>insert something here</p>
        </div>
      </div>
    </>
  )
}
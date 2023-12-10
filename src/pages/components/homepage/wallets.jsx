import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Wallet from './wallet';
import Router from 'next/router';


export default function Wallets({ accountData, setPageNum, setWalletId }) {
  const [viewAll, setViewAll] = useState(false);

  // Framer Motion Variants
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: { duration: 3 }
  };
  
  const item = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Redirects to homepage to connect more accounts
  function connectMoreAccounts() {
    Router.push('/');
  }

  return (
    <>
      <motion.div 
        className="flex flex-wrap"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Generate Wallets */}

        {accountData.map((account, index) => (
          <button 
            key={account.account_id} 
            className="text-left w-1/3 p-1" 
            onClick={() => { setPageNum(1); setWalletId(account.account_id); }}
          >
            <AnimatePresence>
              { (viewAll || index < 3) && (
                <motion.div 
                  key={account.account_id} 
                  variants={item}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Wallet wallet={account} index={index} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </motion.div>

      {/* Connect More Accounts Button */}
      <div className="flex justify-between">
        <div 
          className="mt-3"
        >
          <button>
              <a 
                className="text-center text-md font-bold py-2 px-4 rounded"
                onClick={() => connectMoreAccounts()}
              >
                Connect More Accounts...
              </a>
          </button>

        </div>

        {/* View All Button */}
        <div 
          className="mt-3"
        >
          {viewAll ? (
            <motion.button
              className="bg-primary hover:bg-primary-hover text-center text-md font-bold text-white py-2 px-4 rounded"
              onClick={() => setViewAll(false)}
              whileTap={{ scale: 0.9 }}
            >
              View Less...
            </motion.button>
          ) : (
            <button
              className="bg-primary hover:bg-primary-hover text-center text-md font-bold text-white py-2 px-4 rounded"
              onClick={() => setViewAll(true)}

            >
              View All...
            </button>
          )}
        </div>
      </div>
    </>
  );
}

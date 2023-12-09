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
        <motion.div 
          className="mt-3"
          whileHover={{ scale: 1.01, x: 2 }}
          transition={{
              type: "spring",
              duration: 0.3
          }}
        >
          <button>
              <a 
                className="text-center text-md font-bold"
                onClick={() => connectMoreAccounts()}
              >
                Connect More Accounts...
              </a>
          </button>

        </motion.div>

        {/* View All Button */}
        <motion.div 
          className="mt-3"
          whileHover={{ scale: 1.01, x: -2 }}
          transition={{
              type: "spring",
              duration: 0.3
          }}
        >
          {viewAll ? (
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
          )}
        </motion.div>
      </div>
    </>
  );
}

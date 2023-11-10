import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Wallet from './wallet';

export default function Wallets({ accountData, setPageNum, setWalletId }) {
  const [viewAll, setViewAll] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: { duration: 3 }
  };
  
  const item = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <>
      <motion.div 
        className="flex flex-wrap"
        variants={container}
        initial="hidden"
        animate="visible"
      >
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
      
      <motion.div 
        className="flex justify-end mt-3"
        whileHover={{ scale: 1.01, x: -5 }}
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
    </>
  );
}

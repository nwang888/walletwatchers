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
            <Wallet wallet={account} index={index % 3} />
          </button>
        ))}
      </motion.div>
      {/* ... rest of your Wallets component */}
    </>
  )
}

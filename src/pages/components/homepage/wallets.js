import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import Wallet from './wallet';

export default function Wallets( { accountData, setPageNum, setWalletId }) {

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

    return (
        <>
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
        </>
    )
}
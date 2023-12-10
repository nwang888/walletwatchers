import { useEffect, useState } from 'react';
import { Flex, Button } from '@radix-ui/themes';
import { motion } from 'framer-motion';

export default function NavBar({ pageNum, setPageNum, setWalletId}) {
  return (
    <div className='fixed inset-x-0 bottom-0 flex justify-center items-center bg-white py-3'>
      <Flex direction="row" gap="3">
        <motion.div
          className="mx-[10vw]"
          whileHover={{ scale: 1.05 }}
          transition={{
              type: "spring",
              duration: 0.3
          }}
        >
          <Button 
            onClick={() => setPageNum(0)}
            style={{ backgroundColor: pageNum === 0 ? '#779D58' : 'grey' }}
          >
              Home
          </Button>
        </motion.div>

        <motion.div
          className="mx-[10vw]"
          whileHover={{ scale: 1.05 }}
          transition={{
              type: "spring",
              duration: 0.3
          }}
        >
          <Button 
            onClick={() => {setPageNum(1); setWalletId("");}}
            style={{ backgroundColor: pageNum === 1 ? '#779D58' : 'grey' }}
          >
              Transactions
          </Button>
        </motion.div>

        <motion.div
          className="mx-[10vw]"
          whileHover={{ scale: 1.05 }}
          transition={{
              type: "spring",
              duration: 0.3
          }}
        >
          <Button 
            onClick={() => setPageNum(2)}
            style={{ backgroundColor: pageNum === 2 ? '#779D58' : 'grey' }}
          >
              Wishlist
          </Button>
        </motion.div>
        <motion.div
          className="mx-[10vw]"
          whileHover={{ scale: 1.05 }}
          transition={{
              type: "spring",
              duration: 0.3
          }}
        >
          <Button 
            onClick={() => {setPageNum(3);}}
            style={{ backgroundColor: pageNum === 3 ? '#779D58' : 'grey' }}
          >
              Budgets
          </Button>
        </motion.div>
      </Flex>
    </div>
  );
}
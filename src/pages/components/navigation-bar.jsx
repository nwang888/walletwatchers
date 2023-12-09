import { useEffect, useState } from 'react';
import { Flex, Button } from '@radix-ui/themes';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMoneyBillTransfer, faGifts, faChartPie } from '@fortawesome/free-solid-svg-icons'; // import the icon

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
          <FontAwesomeIcon 
            className={pageNum === 0 ? 'text-accent' : 'text-accent2'} 
            onClick={() => setPageNum(0)}
            icon={faHouse} 
            size='2x'
          />
        </motion.div>

        <motion.div
          className="mx-[10vw]"
          whileHover={{ scale: 1.05 }}
          transition={{
              type: "spring",
              duration: 0.3
          }}
        >
          <FontAwesomeIcon 
            className={pageNum === 1 ? 'text-accent' : 'text-accent2'} 
            onClick={() => setPageNum(1)}
            icon={faMoneyBillTransfer} 
            size='2x'
          />
        </motion.div>

        <motion.div
          className="mx-[10vw]"
          whileHover={{ scale: 1.05 }}
          transition={{
              type: "spring",
              duration: 0.3
          }}
        >
          <FontAwesomeIcon 
            className={pageNum === 2 ? 'text-accent' : 'text-accent2'} 
            onClick={() => setPageNum(2)}
            icon={faGifts} 
            size='2x'
          />
        </motion.div>
        <motion.div
          className="mx-[10vw]"
          whileHover={{ scale: 1.05 }}
          transition={{
              type: "spring",
              duration: 0.3
          }}
        >
          <FontAwesomeIcon 
            className={pageNum === 3 ? 'text-accent' : 'text-accent2'} 
            onClick={() => setPageNum(3)}
            icon={faChartPie} 
            size='2x'
          />
        </motion.div>
      </Flex>
    </div>
  );
}
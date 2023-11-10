import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NavBar({ setPageNum }) {
  const bgColor = '#AA87BE';
  const textColor = '#FFFFFF';

  return (
    <div className="fixed inset-x-0 top-0 flex justify-center items-center py-3 bg-[#AA87BE] shadow-md">
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
        }}
      >
        <h1 
          className="text-2xl md:text-3xl lg:text-4xl font-bold font-custom 'poppin' text-[#FFFFFF] cursor-pointer" 
          onClick={() => setPageNum(0)}
        >
          WALLETWATCHERS
        </h1>
      </motion.div>
    </div>
  );
}

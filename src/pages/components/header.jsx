import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NavBar({ setPageNum }) {

  return (
    <div className="fixed inset-x-0 top-0 flex justify-center items-center py-3 bg-[#efeff6]">
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
        }}
      >
        <h1 
          className="text-xl md:text-2xl lg:text-3xl font-bold font-custom 'poppin' text-[#302e52] cursor-pointer" 
          onClick={() => setPageNum(0)}
        >
          WALLETWATCHERS
        </h1>
      </motion.div>
    </div>
  );
}

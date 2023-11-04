import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NavBar({ setPageNum }) {
  return (
    <div className="fixed inset-x-0 top-0 flex justify-center items-center py-3">
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{
            type: "spring",
            duration: 0.3
        }}
      >

        <h1 className="text-xl font-bold font-header" onClick={() => setPageNum(0)}>WALLETWATCHERS</h1>

      </motion.div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NavBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex justify-center items-center py-3">
      <motion.div
        whileHover={{ x: 1.1 }}
        transition={{
            type: "spring",
            duration: 0.3
        }}
      >
        <h1>Walletwatchers</h1>
      </motion.div>
    </div>
  );
}
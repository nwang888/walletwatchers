import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NavBar() {


  return (

    <>
      <motion.div
        whileHover={{ x: 1.1 }}
        transition={{
            type: "spring",
            duration: 0.3
        }}
      >

        <h1>Walletwatchers</h1>
      </motion.div>

    </>
  )
}
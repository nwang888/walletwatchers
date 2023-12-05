import Router from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import Header from './components/Header';
import { motion } from 'framer-motion';

export default function PlaidLink() {
  const [token, setToken] = useState(null);

  const [data, setData] = useState([]);

  useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch('/api/create-link-token', {
        method: 'POST',
      });
      const { link_token } = await response.json();
      setToken(link_token);
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback(async (publicToken) => {
    await fetch('/api/exchange-public-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token: publicToken }),
    });
    Router.push('/dash');
  }, []);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <div className="z-10">

      <Header />

      <div className='mt-[20vh] max-w-[60%] mx-auto'>
        <motion.p 
          className='text-text text-center text-5xl font-semibold mx-auto'
          initial={{opacity: 0 }}
          animate={{opacity: 1 }}

          transition={{ duration: 1, delay: 0.8 }}
        >
          Reimagine Financial Transparency
        </motion.p>

        <motion.p 
          className='text-subtext max-w-[90%] text-center text-xl font-normal my-4 mx-auto'
          initial={{opacity: 0 }}
          animate={{opacity: 1 }}

          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.span className='font-semibold' animate={{color: ["#525252", "#25311c", "#3e522e", "#577240", "#709353", "#89ac6c"]}} transition={{ duration: 0.6, delay: 1.8 }}>Supercharge </motion.span> your finances with cross-account viewing, smart budget optimization, and comprehensive expense reports
        </motion.p>
      </div>




      <motion.div 
        className="flex justify-center my-10"
        initial={{opacity: 0 }}
        animate={{opacity: 1 }}

        transition={{ duration: 0.4, delay: 2.5 }}
      >
        <motion.button 
          className="text-background bg-primary font-semibold py-3 px-5 rounded-lg hover:bg-primary-hover transition-all"

          whileHover={{
            y: -1,
            transition: { duration: 0.1, type: "linear" },
          }}
          whileTap={{ scale: 0.9 }}

          onClick={() => open()} disabled={!ready}>
          Get Started
        </motion.button>
      </motion.div>

    </div>
  );
}
import Router from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import Header from './components/header';
import Loading from './loading';
import { motion } from 'framer-motion';

import InfoBoxes from './components/landing/info-boxes';



export default function PlaidLink() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

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

      {
        isLoading ? (
          <Loading />
        ) : (




          <>
            <Header setPageNum={(num) => {return}}/>
              <div className='mt-[16vh] max-w-[60%] mx-auto'>
                <motion.p 
                  className='text-text text-center text-4xl font-semibold mx-auto'
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
                  <motion.span className='font-semibold' animate={{color: ["#525252", "#5b5d58", "#63695f", "#6c7565", "#75816c", "#7e8d72", "#879979", "#90a580", "#9ab286", "#a3bf8d"]}} transition={{ duration: 0.4, delay: 1.5 }}>Supercharge </motion.span> your finances with cross-account viewing, smart budget optimization, and comprehensive expense reports
                </motion.p>
              </div>




              <motion.div 
                className="flex justify-center mt-7 mb-10"
                initial={{opacity: 0 }}
                animate={{opacity: 1 }}

                transition={{ duration: 0.4, delay: 1.5 }}
              >
                <motion.button 
                  className="text-background bg-primary font-semibold py-3 px-5 rounded-lg hover:bg-primary-hover transition-all"

                  whileTap={{ scale: 0.9 }}

                  onClick={() => open()} disabled={!ready}>
                  Get Started
                </motion.button>
              </motion.div>

              <InfoBoxes />
          </>
        )
      }



    </div>
  );
}

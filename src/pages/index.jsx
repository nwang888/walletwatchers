import Router from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import Head from 'next/head';

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
      {/* <ParticleBackground /> */}

      <Header />

      <div className='mt-[20vh] max-w-[60%] mx-auto'>
        <p className='text-text text-center text-5xl font-semibold mx-auto'>
          Reimagine Financial Transparency
        </p>

        <p className='text-subtext max-w-[90%] text-center text-xl font-normal my-4 mx-auto'>
          <span className='text-accent'>Supercharge</span> your finances with cross-account viewing, smart budget optimization, and comprehensive expense reports
        </p>
      </div>




      <div className="flex justify-center my-5">
        <button className="text-background bg-primary font-semibold py-3 px-5 rounded-lg hover:bg-primary-hover transition-all" onClick={() => open()} disabled={!ready}>
          Link Account
        </button>
      </div>

    </div>
  );
}

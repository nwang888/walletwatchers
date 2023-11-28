import Router from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

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
    <>
       <div className="flex justify-center items-center text-sky-400/50 text-8xl font-semibold self-stretch whitespace-nowrap mt-20 max-md:max-w-full max-md:text-4xl">
      Welcome Back!
    </div>

      <div className="flex justify-center ">
  <button className="px-4 py-2 bg-blue-500 text-white rounded items-center" onClick={() => open()} disabled={!ready}>
    Link Account
  </button>
</div>

    </>
  );
}

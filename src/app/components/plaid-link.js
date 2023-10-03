'use client'

import React, { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function PlaidLink() {

    const [token, setToken] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // gets called after a successful Plaid Link flow
    const onSuccess = useCallback(async (publicToken) => {
        setLoading(true);
        // send public token in body to retrieve access token from Plaid API
        await fetch("/api/plaid/exchange_public_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ public_token: publicToken }),
        });
        await getBalance();
    }, []);


    const config = {
        token,
        onSuccess,
    };
    const { open, ready } = usePlaidLink(config);

    // on page load, we fetch a link token and store it in state
    useEffect(() => {
        if (token == null) {
          createLinkToken();
        }
        if (ready) {
          open();
        }
    }, [token, ready, open]);

    // creates a Link token
    const createLinkToken = React.useCallback(async () => {
        // For OAuth, use previously generated Link token
        const response = await fetch("/api/plaid/create_link_token", {});
        const data = await response.json();
        setToken(data.link_token);
        localStorage.setItem("link_token", data.link_token);
        console.log("retrieved link token from /api/create_link_token");
        
    }, [setToken]);

    // fetch balance data
    const getBalance = React.useCallback(async () => {
        setLoading(true);
        console.log('fetching balance');
        const response = await fetch("/api/plaid/balance", {});
        const data = await response.json();
        setData(data);
        setLoading(false);
    }, [setData, setLoading]);

    return (
        <div>
            
            <div>
                <button onClick={() => open()} disabled={!ready}>
                    Link Account
                </button>
            </div>
    
            {
                !loading && data && 
                Object.entries(data).map((entry, i) => (
                    <div key={i}>
                        {JSON.stringify(entry[1], null, 2)}
                    </div>
                ))
            }

        </div>


    );
}
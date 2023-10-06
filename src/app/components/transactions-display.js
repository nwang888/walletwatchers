"use client";

import React, { useState, useEffect, useCallback } from "react";
import Button from '@mui/material/Button';
import { usePlaidLink } from "react-plaid-link";

export default function TransactionDisplay() {
	const [transactionData, setTransactionData] = useState(null);
	const [loading, setLoading] = useState(true);

	// fetch transactions
	const fetchTransactions = useCallback(async () => {
		setLoading(true);
		console.log("fetching transactions endpoint");
		const response = await fetch("/api/plaid/transactions", {});
		const data = await response.json();
		setTransactionData(data);
		setLoading(false);
	}, [setTransactionData, setLoading]);

	// Button click handler
	const handleClick = async () => {
		await fetchTransactions();
	};

	return (
		<div>
			{!loading &&
				transactionData &&
				Object.entries(transactionData).map((entry, i) => (
					<div key={i}>{JSON.stringify(entry[1], null, 2)}</div>
				))}

			<Button onClick={handleClick}>Fetch transaction data</Button>
		</div>
	);
}

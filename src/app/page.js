"use client";

import { useState } from "react";

import PlaidLink from "./components/plaid-link";
import TransactionDisplay from "./components/transactions-display";
import WishList from "./components/user-wishlist";

export default function Home() {
	const [data, setData] = useState("");

	return (
		<>
			<PlaidLink />
			<WishList />
			<TransactionDisplay />
		</>
	);
}

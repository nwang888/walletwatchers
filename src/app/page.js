"use client";

import { useState } from "react";

import FoodRating from './components/food-rating';
import Budget from './components/budget-category';
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

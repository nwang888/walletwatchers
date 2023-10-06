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
			<hr></hr>

			<div className="my-[20%]">
				<h1>TRANSACTIONS</h1>
				<TransactionDisplay />
				<hr></hr>
			</div>

			<div className="my-[20%]">
				<h1>WISHLIST</h1>
				<WishList />
				<hr></hr>
			</div>

			<div className="my-[20%]">
				<Budget />
			</div>
		</>
	);
}

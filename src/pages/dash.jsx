import { withIronSessionSsr } from "iron-session/next";
import { plaidClient, sessionOptions } from "../lib/plaid";
import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import HomePage from "./components/home-page";
import TransactionsPage from "./components/transactions-page";
import WishlistPage from "./components/wishlist-page";

import Header from "./components/header";
import NavBar from "./components/navigation-bar";

export default function Dashboard() {
	const [pageNum, setPageNum] = useState(0);

	return (
		<>
			<Header setPageNum={setPageNum} />

			<div className="pt-16">
				{pageNum === 0 ? <HomePage /> : null}
				{pageNum === 1 ? <TransactionsPage /> : null}
				{pageNum === 2 ? <WishlistPage /> : null}
			</div>

			<NavBar pageNum={pageNum} setPageNum={setPageNum} />
		</>
	);
}

const postAccountData = async (accounts, numbers, req) => {
	const dataToSend = {
		accounts: accounts,
		numbers: numbers.ach
	};

	const protocol = req.headers["x-forwarded-proto"] || "http";
	const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

	const res = await fetch(`${baseUrl}/api/account`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(dataToSend)
	});

	const data = await res.json();
	console.log("Response (from client):", data);
};

const postTransactionData = async (
	added,
	modified,
	removed,
	initial_cursor,
	new_cursor,
	req
) => {
	const dataToSend = {
		added: added,
		modified: modified,
		removed: removed,
		cursor: initial_cursor,
		new_cursor: new_cursor
	};

	const protocol = req.headers["x-forwarded-proto"] || "http";
	const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

	const res = await fetch(`${baseUrl}/api/transactions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(dataToSend)
	});

	const data = await res.json();
	console.log("Response (from client):", data);
};

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		const protocol = req.headers["x-forwarded-proto"] || "http";
		const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

		// initalizes bigdb on login
		const initialize_bigdb = await fetch(`${baseUrl}/api/bigdb`);

		const access_token = req.session.access_token;

		console.log("started");

		if (!access_token) {
			return {
				redirect: {
					destination: "/",
					permanent: false
				}
			};
		}

		// ----------------- Accounts -----------------

		const accountBalance = await plaidClient.authGet({ access_token });

		await postAccountData(
			accountBalance.data.accounts,
			accountBalance.data.numbers,
			req
		);

		// ----------------- Transactions -----------------

		// get first cursor
		const initial_cursor_data = await fetch(`${baseUrl}/api/cursor`);
		let initial_cursor = await initial_cursor_data.data;

		// console.log("initial cursor: " + initial_cursor);

		// const transactionsPage = await plaidClient.transactionsSync({
		// 	"access_token": access_token,
		// 	"cursor": initial_cursor,
		// 	"count": 500
		// });

		// console.log("Fetched initial transactions page");

		// let next_cursor = transactionsPage.data.next_cursor;

		// await postTransactionData(
		// 	transactionsPage.data.added,
		// 	transactionsPage.data.modified,
		// 	transactionsPage.data.removed,
		// 	initial_cursor,
		// 	next_cursor,
		// 	req
		// );

		// paginate through all transactions
		let hasMore = true;

		while (hasMore) {
			const transactionsPage = await plaidClient.transactionsSync({
				"access_token": access_token,
				"cursor": initial_cursor,
				"count": 500
			});
			console.log("Fetched transactions page");

			next_cursor = transactionsPage.data.next_cursor;

			await postTransactionData(
				transactionsPage.data.added,
				transactionsPage.data.modified,
				transactionsPage.data.removed,
				initial_cursor,
				next_cursor,
				req
			);
			console.log("Posted transactions page");

			hasMore = transactionsPage.data.has_more;
			initial_cursor = next_cursor;
		}

		return {
			props: {
				balance: accountBalance.data
			}
		};
	},
	sessionOptions
);
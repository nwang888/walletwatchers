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

const postTransactionData = async (added, modified, removed, cursor, req) => {
	const dataToSend = {
		added: added,
		modified: modified,
		removed: removed,
		cursor: cursor
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

		const accountBalance = await plaidClient.authGet({ access_token });

		await postAccountData(
			accountBalance.data.accounts,
			accountBalance.data.numbers,
			req
		);

		const cursor = await fetch(`${baseUrl}/api/cursor`);

		const transactionsPage = await plaidClient.transactionsSync({
			"access_token": access_token,
			"cursor": null,
			"count": 500
		});

		console.log("Fetched initial transactions");

		// transactionsPage.data.next_cursor;
		// transactionsPage.data.has_more;

		await postTransactionData(
			transactionsPage.data.added,
			transactionsPage.data.modified,
			transactionsPage.data.removed,
			cursor,
			req
		);

		return {
			props: {
				balance: accountBalance.data
			}
		};
	},
	sessionOptions
);

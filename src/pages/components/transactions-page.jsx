import { get } from "http";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState([]);

	const getTransactionsData = async () => {
		const response = await fetch("/api/transactions");
		const data = await response.json();
		setTransactions(data);
	};

	useEffect(() => {
		getTransactionsData();
	}, []);

	return (
		<div>
			<h1>Transactions</h1>
			{transactions.length > 0 ? (
				<ul>
					{transactions.map((transaction, index) => (
						<li key={index}>
							<p>Transaction ID: {transaction.transaction_id}</p>
							<p>Account ID: {transaction.account_id}</p>
							<p>Primary Category: {transaction.category_primary}</p>
							<p>Detailed Category: {transaction.category_detailed}</p>
							<p>Merchant Name: {transaction.merchant_name}</p>
							<p>Store Number: {transaction.store_number}</p>
							<p>Logo URL: {transaction.logo_url}</p>
							<p>Transaction Amount: {transaction.transaction_amount}</p>
							<p>Address: {transaction.address}</p>
							<p>City: {transaction.city}</p>
							<p>Region: {transaction.region}</p>
							<p>Postal Code: {transaction.postal_code}</p>
							<p>Country: {transaction.country}</p>
							<p>Datetime: {transaction.datetime}</p>
							<p>Payment Channel: {transaction.payment_channel}</p>
							<p>Cursor: {transaction.cursor}</p>
							<p>Next Cursor: {transaction.next_cursor}</p>
						</li>
					))}
				</ul>
			) : (
				<p>No transactions found.</p>
			)}
		</div>
	);
}

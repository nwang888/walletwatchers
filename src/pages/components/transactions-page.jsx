import { useEffect, useState } from "react";
import { Table } from "@radix-ui/themes";

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState([]);

	const getTransactionsData = async () => {
		const response = await fetch("/api/transactions");
		const data = await response.json();
		// if (data.length > 0) {
		// 	console.log("Transactions data fetched successfully.");
		// 	console.log(data);
		// }
		setTransactions(data);
		// console.log("Getting transactions array");
		// console.log(transactions);

		// if (transactions.length > 0) {
		// 	console.log(transactions[0]);
		// 	console.log(transactions[0].category_primary);
		// } else {
		// 	console.log("No transactions found.");
		// }
	};

	useEffect(() => {
		getTransactionsData();
	}, []);

	return (
		<div>
			{transactions.length > 0 ? (
				<Table.Root variant="surface">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell>Primary Category</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Detailed Category</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Merchant Name</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								Transaction Amount
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>City</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{transactions.map((transaction, index) => (
							<Table.Row key={index}>
								<Table.RowHeaderCell>
									{transaction.category_primary}
								</Table.RowHeaderCell>
								<Table.Cell>{transaction.category_detailed}</Table.Cell>
								<Table.Cell>{transaction.merchant_name}</Table.Cell>
								<Table.Cell>{transaction.transaction_amount}</Table.Cell>
								<Table.Cell>{transaction.city}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			) : (
				<p>No transactions found.</p>
			)}
		</div>
	);
}

import { useEffect, useState } from "react";
import { Table } from "@radix-ui/themes";
import { Flex, Button } from "@radix-ui/themes";
import { motion } from "framer-motion";

//TODO: Add pagination
//TODO: Add search
//TODO: Add filtering for all columns

export default function TransactionsTable() {
	const [transactions, setTransactions] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [sortAttribute, setSortAttribute] = useState("datetime");
	const [sortOrder, setSortOrder] = useState({
		category_primary: "asc",
		category_detailed: "asc",
		merchant_name: "asc",
		transaction_amount: "desc",
		city: "asc",
		region: "asc",
		datetime: "desc",
		account_name: "asc"
	});

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
		getTransactionsData(
			sortAttribute,
			sortOrder[sortAttribute],
			newPage,
			rowsPerPage
		);
	};

	const handleSort = (attribute) => {
		const newOrder = sortOrder[attribute] === "asc" ? "desc" : "asc";
		setSortAttribute(attribute);
		setSortOrder({ ...sortOrder, [attribute]: newOrder });
		getTransactionsData(attribute, newOrder);
	};

	const getTransactionsData = async (
		sort_by = "transaction_amount",
		order = "desc",
		page = 1,
		rowsPerPage = 10,
		paginate = true
	) => {
		const response = await fetch(
			`/api/transactions?sort_by=${sort_by}&order=${order}&page=${page}&rowsPerPage=${rowsPerPage}&paginate=${paginate}`
		);
		const data = await response.json();
		setTransactions(data);
	};

	useEffect(() => {
		getTransactionsData();
	}, []);

	return (
		<div>
			{transactions.length > 0 ? (
				<div>
					<Table.Root variant="surface">
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>
									<div style={{ display: "flex", alignItems: "center" }}>
										Account
										<Flex gap="3">
											<Button
												radius="large"
												variant="surface"
												highContrast
												color="orange"
												size="1"
												onClick={() => handleSort("account_name")}
												style={{ marginLeft: "5px" }}
											>
												Sort
											</Button>
										</Flex>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div style={{ display: "flex", alignItems: "center" }}>
										Primary Category
										<Flex gap="3">
											<Button
												radius="large"
												variant="surface"
												highContrast
												color="orange"
												size="1"
												onClick={() => handleSort("category_primary")}
												style={{ marginLeft: "5px" }}
											>
												Sort
											</Button>
										</Flex>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div style={{ display: "flex", alignItems: "center" }}>
										Detailed Category
										<Flex gap="3">
											<Button
												radius="large"
												variant="surface"
												highContrast
												color="orange"
												size="1"
												onClick={() => handleSort("category_detailed")}
												style={{ marginLeft: "5px" }}
											>
												Sort
											</Button>
										</Flex>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div style={{ display: "flex", alignItems: "center" }}>
										Merchant Name
										<Flex gap="3">
											<Button
												radius="large"
												variant="surface"
												highContrast
												color="orange"
												size="1"
												onClick={() => handleSort("merchant_name")}
												style={{ marginLeft: "5px" }}
											>
												Sort
											</Button>
										</Flex>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div style={{ display: "flex", alignItems: "center" }}>
										Transaction Amount
										<Flex gap="3">
											<Button
												radius="large"
												variant="surface"
												highContrast
												color="orange"
												size="1"
												onClick={() => handleSort("transaction_amount")}
												style={{ marginLeft: "5px" }}
											>
												Sort
											</Button>
										</Flex>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div style={{ display: "flex", alignItems: "center" }}>
										City
										<Flex gap="3">
											<Button
												radius="large"
												variant="surface"
												highContrast
												color="orange"
												size="1"
												onClick={() => handleSort("city")}
												style={{ marginLeft: "5px" }}
											>
												Sort
											</Button>
										</Flex>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div style={{ display: "flex", alignItems: "center" }}>
										Region
										<Flex gap="3">
											<Button
												radius="large"
												variant="surface"
												highContrast
												color="orange"
												size="1"
												onClick={() => handleSort("region")}
												style={{ marginLeft: "5px" }}
											>
												Sort
											</Button>
										</Flex>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div style={{ display: "flex", alignItems: "center" }}>
										Datetime
										<Flex gap="3">
											<Button
												radius="large"
												variant="surface"
												highContrast
												color="orange"
												size="1"
												onClick={() => handleSort("datetime")}
												style={{ marginLeft: "5px" }}
											>
												Sort
											</Button>
										</Flex>
									</div>
								</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{transactions.map((transaction, index) => (
								<Table.Row key={index}>
									<Table.RowHeaderCell>
										{transaction.account_name}
									</Table.RowHeaderCell>
									<Table.Cell>{transaction.category_primary}</Table.Cell>
									<Table.Cell>{transaction.category_detailed}</Table.Cell>
									<Table.Cell>{transaction.merchant_name}</Table.Cell>
									<Table.Cell>{transaction.transaction_amount}</Table.Cell>
									<Table.Cell>{transaction.city}</Table.Cell>
									<Table.Cell>{transaction.region}</Table.Cell>
									<Table.Cell>{transaction.datetime}</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</button>
					<button onClick={() => handlePageChange(currentPage + 1)}>
						Next
					</button>
				</div>
			) : (
				<p>No transactions found.</p>
			)}
		</div>
	);
}

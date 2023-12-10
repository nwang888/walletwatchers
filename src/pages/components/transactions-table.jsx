import { useRef, useEffect, useState } from "react";
import React from "react";
import * as Select from "@radix-ui/react-select";
import { Flex, Button, Table } from "@radix-ui/themes";
import { motion } from "framer-motion";
import "@radix-ui/colors/gray.css";

<<<<<<< HEAD
//TODO: Add search
//TODO: Add filtering for all columns

=======
>>>>>>> main
export default function TransactionsTable(walletID) {
	const [transactions, setTransactions] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [totalRows, setTotalRows] = useState(0);
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
	const [cur_filters, setFilters] = useState({});

	const handleRowsPerPageChange = (value) => {
		const newRowsPerPage = parseInt(value);
		setRowsPerPage(newRowsPerPage);
		setCurrentPage(1);
		getTransactionsData({
			sort_by: sortAttribute,
			order: sortOrder[sortAttribute],
			rowsPerPage: newRowsPerPage,
			filters: cur_filters
		});
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
		getTransactionsData({
			sort_by: sortAttribute,
			order: sortOrder[sortAttribute],
			page: newPage,
			rowsPerPage: rowsPerPage,
			filters: cur_filters
		});
	};

	const handleSort = (attribute) => {
		const newOrder = sortOrder[attribute] === "asc" ? "desc" : "asc";
		setSortAttribute(attribute);
		setSortOrder({ ...sortOrder, [attribute]: newOrder });
		getTransactionsData({
			sort_by: attribute,
			order: newOrder,
			rowsPerPage: rowsPerPage,
			filters: cur_filters
		});
	};

	const handleFilter = (newFilters) => {
		// const newFilters = { ...filters, [attribute]: value };
		setFilters(newFilters);
		getTransactionsData({
			sort_by: sortAttribute,
			order: sortOrder[sortAttribute],
			rowsPerPage: rowsPerPage,
			filters: newFilters
		});
	};

	const getTransactionsData = async ({
		sort_by = "transaction_amount",
		order = "desc",
		page = 1,
		rowsPerPage = 10,
		paginate = true,
		filters = {}
	} = {}) => {
		// console.log("Front End filters", filters);
		const response = await fetch(
			`/api/transactions?sort_by=${sort_by}&order=${order}&page=${page}&rowsPerPage=${rowsPerPage}&paginate=${paginate}&filters=${encodeURIComponent(
				JSON.stringify(filters)
			)}`
		);
		const data = await response.json();
		setTransactions(data.transactions);
		setTotalRows(data.totalRows);
	};

	useEffect(() => {
		console.log("walletID", walletID.walletId);
		if (walletID.walletId && walletID.walletId !== "") {
			const newFilters = { "account_id": walletID.walletId };
			setFilters(newFilters);
			getTransactionsData({
				sort_by: "transaction_amount",
				order: "desc",
				page: 1,
				rowsPerPage: 10,
				paginate: true,
				filters: newFilters
			});
		} else getTransactionsData();
	}, [walletID]);
	// handleFilter({ "account_name": "Plaid Checking" });
	// sortAttribute,
	// sortOrder[sortAttribute],
	// 1,
	// rowsPerPage,
	// true,
	// { "account_name": "Plaid Checking" }

	return (
<<<<<<< HEAD
		<div>
			{transactions.length > 0 ? (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						height: "80vh",
						position: "relative"
					}}
				>
					<div style={{ flexGrow: 1, overflowY: "auto" }}>
						<Table.Root variant="surface">
							<Table.Header>
								<Table.Row>
									<Table.ColumnHeaderCell>
=======
		<div className="my-5">
            <p className="text-xl font-bold">All Transactions</p>
			{/* ----------- FILTERS -----------*/}
			<div>
				<div className="flex justify-center items-center">
					<span className="mr-2">Filter:</span>
					{columns.map(
						(column) =>
							(column.sortKey === "category_primary" ||
								column.sortKey === "category_detailed") && (
								<div key={column.sortKey} class="pl-3">
									{/* <label>{column.name}</label> */}
									<Select
										options={
											column.sortKey === "category_primary"
												? Object.keys(categoryMapping).map((option) => ({
														label: option,
														value: option
												  }))
												: Object.entries(categoryMapping)
														.filter(([key]) =>
															curFilters["category_primary"].includes(key)
														)
														.flatMap(([, value]) => value)
														.map((option) => ({
															label: option,
															value: option
														}))
										}
										placeholder={`Select ${column.name}`}
										onChange={(selectedOptions) => {
											// Convert selectedOptions from array of objects to array of values
											const newSelectedOptions = selectedOptions
												? selectedOptions.map((option) => option.value)
												: [];

											// Find options that were selected
											const selected = newSelectedOptions.filter(
												(option) => !curFilters[column.sortKey].includes(option)
											);

											// If there are any selected options, handle them
											if (selected.length > 0) {
												handleFilterChange(column.sortKey, selected, true);
											}

											// Find options that were deselected
											const deselected = curFilters[column.sortKey].filter(
												(option) => !newSelectedOptions.includes(option)
											);

											// If there are any deselected options, handle them
											if (deselected.length > 0) {
												handleFilterChange(column.sortKey, deselected, false);
											}
										}}
										isSearchable={true}
										isMulti
									/>
								</div>
							)
					)}
				</div>
			</div>
			{/* ----------- TABLES -----------*/}
			<div className="flex flex-col h-screen relative">
				<div class={{ flexGrow: 1, overflowY: "auto" }}>
					<Table.Root variant="surface">
						<Table.Header>
							<Table.Row>
								{columns.map((column) => (
									<Table.ColumnHeaderCell key={column.sortKey}>
										{/* -------- SORT BUTTON -------- */}
>>>>>>> main
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
					</div>
					<div className="pt-5 items-center justify-center">
						<div className="text-center">Rows per page:</div>
						<div className="flex space-x-4 items-center justify-center pt-5">
							<motion.div
								whileHover={{ scale: 1.03 }}
								transition={{
									type: "spring",
									duration: 0.3
								}}
							>
								<Button
									color={rowsPerPage === 10 ? "indigo" : "gray"}
									onClick={() => handleRowsPerPageChange(10)}
								>
									10
								</Button>
							</motion.div>
							<motion.div
								className="mx-[10vw]"
								whileHover={{ scale: 1.03 }}
								transition={{
									type: "spring",
									duration: 0.3
								}}
							>
								<Button
									color={rowsPerPage === 20 ? "indigo" : "gray"}
									onClick={() => handleRowsPerPageChange(20)}
								>
									20
								</Button>
							</motion.div>
							<motion.div
								className="mx-[10vw]"
								whileHover={{ scale: 1.03 }}
								transition={{
									type: "spring",
									duration: 0.3
								}}
							>
								<Button
									color={rowsPerPage === 50 ? "indigo" : "gray"}
									onClick={() => handleRowsPerPageChange(50)}
								>
									50
								</Button>
							</motion.div>
						</div>
					</div>
					<div>
						<Flex
							style={{
								paddingTop: "20px",
								justifyContent: "center",
								marginTop: "20px"
							}}
						>
							<motion.div
								whileHover={{ scale: 1.03 }}
								transition={{
									type: "spring",
									duration: 0.3
								}}
							>
								<Button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
								>
									Previous
								</Button>
							</motion.div>
							<div style={{ margin: "0 10px" }}>
								Page {currentPage} / {Math.ceil(totalRows / rowsPerPage)}{" "}
							</div>
							<motion.div
								whileHover={{ scale: 1.03 }}
								transition={{
									type: "spring",
									duration: 0.3
								}}
							>
								<Button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === Math.ceil(totalRows / rowsPerPage)}
								>
									Next
								</Button>
							</motion.div>
						</Flex>
					</div>
				</div>
			) : (
				<p>No transactions found.</p>
			)}
		</div>
	);
}

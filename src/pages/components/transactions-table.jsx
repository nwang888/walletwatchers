import { useRef, useEffect, useState } from "react";
import React from "react";
// import * as Select from "@radix-ui/react-select";
import { Flex, Button, Table } from "@radix-ui/themes";
import { motion } from "framer-motion";
// import * as Checkbox from "@radix-ui/react-checkbox";
// import { CheckIcon } from "@radix-ui/react-icons";
// import { MultiSelect } from "react-multi-select-component";
import Select from "react-select";

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

	const [curFilters, setFilters] = useState({});
	// cur_filters should be a dict of this format: { "account_id": "Plaid Checking", "category_primary": ["income", "transfer in"], "category_detailed": ["income dividends", "income interest earned"] }
	// console.log("curFilters", curFilters);

	const [categoryMapping, setCategoryMapping] = useState({});

	const handleRowsPerPageChange = (value) => {
		const newRowsPerPage = parseInt(value);
		setRowsPerPage(newRowsPerPage);
		setCurrentPage(1);
		getTransactionsData({
			sort_by: sortAttribute,
			order: sortOrder[sortAttribute],
			rowsPerPage: newRowsPerPage,
			filters: curFilters
		});
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
		getTransactionsData({
			sort_by: sortAttribute,
			order: sortOrder[sortAttribute],
			page: newPage,
			rowsPerPage: rowsPerPage,
			filters: curFilters
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
			filters: curFilters
		});
	};

	const handleFilterChange = (attribute, attributeValues, checked) => {
		const newFilters = { ...curFilters };

		if (checked) {
			if (!newFilters[attribute]) {
				newFilters[attribute] = [];
			}
			newFilters[attribute] = [...newFilters[attribute], ...attributeValues];

			// If a primary category is being selected, also select the associated detailed categories
			if (attribute === "category_primary") {
				attributeValues.forEach((attributeValue) => {
					const detailedCategories = categoryMapping[attributeValue];
					if (!newFilters["category_detailed"]) {
						newFilters["category_detailed"] = [];
					}
					newFilters["category_detailed"] = [
						...newFilters["category_detailed"],
						...detailedCategories
					];
				});
			}
		} else {
			if (newFilters[attribute]) {
				newFilters[attribute] = newFilters[attribute].filter(
					(value) => !attributeValues.includes(value)
				);
				// If a primary category is being deselected, also deselect the associated detailed categories
				if (attribute === "category_primary") {
					attributeValues.forEach((attributeValue) => {
						const detailedCategories = categoryMapping[attributeValue];
						newFilters["category_detailed"] = newFilters[
							"category_detailed"
						].filter((value) => !detailedCategories.includes(value));
					});
				}
			}
		}
		console.log("filter params", attribute, attributeValues, checked);
		console.log("newFilters", newFilters);
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
		fetch("http://localhost:3000/api/categories?isMap=true")
			.then((response) => response.json())
			.then((data) => {
				setCategoryMapping(data);
				const newFilters = {
					category_primary: Object.keys(data),
					category_detailed: [].concat(...Object.values(data)),
					...(walletID.walletId && walletID.walletId !== ""
						? { "account_id": walletID.walletId }
						: {})
				};
				setFilters(newFilters);
				getTransactionsData({
					sort_by: "transaction_amount",
					order: "desc",
					page: 1,
					rowsPerPage: 10,
					paginate: true,
					filters: newFilters
				});
			})
			.catch((error) => console.error("Error:", error));
	}, [walletID]);

	const columns = [
		{ name: "Account", sortKey: "account_name" },
		{ name: "Primary Category", sortKey: "category_primary" },
		{ name: "Detailed Category", sortKey: "category_detailed" },
		{ name: "Merchant", sortKey: "merchant_name" },
		{ name: "Amount", sortKey: "transaction_amount" },
		{ name: "City", sortKey: "city" },
		{ name: "Region", sortKey: "region" },
		{ name: "Datetime", sortKey: "datetime" }
	];
	return (
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
			<div className="flex flex-col h-screen relative mt-5">
				<div class={{ flexGrow: 1, overflowY: "auto" }}>
					<Table.Root variant="surface">
						<Table.Header>
							<Table.Row>
								{columns.map((column) => (
									<Table.ColumnHeaderCell key={column.sortKey}>
										{/* -------- SORT BUTTON -------- */}
										<div style={{ display: "flex", alignItems: "center" }}>
											{column.name}
											<Flex gap="3">
												<motion.button
													onClick={() => handleSort(column.sortKey)}
													className="text-background bg-primary text-xs font-semibold mx-3 p-1 rounded-lg hover:bg-primary-hover transition-all"
												>
													sort
												</motion.button>
											</Flex>
										</div>
									</Table.ColumnHeaderCell>
								))}
							</Table.Row>
						</Table.Header>

						{transactions.length === 0 ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "30vh",
									textAlign: "center"
								}}
							>
								No Transactions Found
							</div>
						) : (
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
						)}
					</Table.Root>
				</div>
				{/* ----------- ROWS PER PAGE OPTIONS -----------*/}
				<div className="pt-5 items-center justify-center">
					<div className="text-center">Rows per page:</div>
					<div className="flex space-x-4 items-center justify-center pt-5">
						<motion.div
							whileHover={{ scale: 1.05 }}
							transition={{
								type: "spring",
								duration: 0.3
							}}
						>
							{/* <Button
								color={rowsPerPage === 10 ? "cyan" : "indigo"}
								onClick={() => handleRowsPerPageChange(10)}
							>
								10
							</Button> */}

							<motion.button whileTap={{ scale: 0.9 }} onClick={() => handleRowsPerPageChange(10)} className={(rowsPerPage === 10 ? "bg-primary" : "bg-accent2") + " hover:bg-primary-hover text-white font-bold py-2 px-4 rounded"}>
								10
							</motion.button>
						</motion.div>
						<motion.div
							className="mx-[10vw]"
							whileHover={{ scale: 1.05 }}
							transition={{
								type: "spring",
								duration: 0.3
							}}
						>
							<motion.button whileTap={{ scale: 0.9 }} onClick={() => handleRowsPerPageChange(20)} className={(rowsPerPage === 20 ? "bg-primary" : "bg-accent2") + " hover:bg-primary-hover text-white font-bold py-2 px-4 rounded"}>
								20
							</motion.button>
						</motion.div>
						<motion.div
							className="mx-[10vw]"
							whileHover={{ scale: 1.05 }}
							transition={{
								type: "spring",
								duration: 0.3
							}}
						>
							<motion.button whileTap={{ scale: 0.9 }} onClick={() => handleRowsPerPageChange(50)} className={(rowsPerPage === 50 ? "bg-primary" : "bg-accent2") + " hover:bg-primary-hover text-white font-bold py-2 px-4 rounded"}>
								50
							</motion.button>
						</motion.div>
					</div>
				</div>
				{/* ----------- PAGINATION BUTTONS -----------*/}
				<div className="pt-5 mt-5 pb-20 flex justify-center">
					<motion.button
						onClick={() => handlePageChange(currentPage - 1)}
						whileTap={{ scale: 0.9 }}
						disabled={currentPage === 1}
						className={(currentPage === 1 ? "bg-accent2" : "bg-primary hover:bg-primary-hover") + " text-background text-sm font-semibold mx-3 p-3 rounded-lg transition-all"}
					>
						Prev
					</motion.button>

					<div className="mx-2.5 my-auto">
						Page {currentPage} / {Math.ceil(totalRows / rowsPerPage)}{" "}
					</div>

					<motion.button
						onClick={() => handlePageChange(currentPage + 1)}
						whileTap={{ scale: 0.9 }}
						disabled={currentPage === Math.ceil(totalRows / rowsPerPage)}
						className={(currentPage === Math.ceil(totalRows / rowsPerPage) ? "bg-accent2" : "bg-primary hover:bg-primary-hover") + " text-background text-sm font-semibold mx-3 p-3 rounded-lg transition-all"}
					>
						Next
					</motion.button>
				</div>
			</div>
		</div>
	);
}

import { useRef, useEffect, useState } from "react";
import React from "react";
// import * as Select from "@radix-ui/react-select";
import { Flex, Button, Table } from "@radix-ui/themes";
import { motion } from "framer-motion";
// import * as Checkbox from "@radix-ui/react-checkbox";
// import { CheckIcon } from "@radix-ui/react-icons";
// import { MultiSelect } from "react-multi-select-component";
import Select from "react-select";

//TODO: Add search
//TODO: Add filtering for all columns
// THings i was doing: making sure checkboxes are checked by default
// Making sur eSElect none works
// Getting SElect all for detailed_categories to work

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
			newFilters[attribute].push(attributeValues);
		} else {
			if (newFilters[attribute]) {
				newFilters[attribute] = newFilters[attribute].filter(
					(value) => value !== attributeValues
				);
				// If a primary category is being deselected, also deselect the associated detailed categories
				if (attribute === "category_primary") {
					const detailedCategories = categoryMapping[attributeValues];
					newFilters["category_detailed"] = newFilters[
						"category_detailed"
					].filter((value) => !detailedCategories.includes(value));
				}
			}
		}
		console.log("params", attribute, attributeValues, checked);
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
				setFilters({
					category_primary: Object.keys(data),
					category_detailed: [].concat(...Object.values(data))
				});
			})
			.catch((error) => console.error("Error:", error));

		if (walletID.walletId && walletID.walletId !== "") {
			const newFilters = { ...curFilters, "account_id": walletID.walletId };
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
		<div>
			{/* ----------- FILTERS -----------*/}
			<div>
				<div className="flex justify-center items-center">
					{columns.map(
						(column) =>
							(column.sortKey === "category_primary" ||
								column.sortKey === "category_detailed") && (
								<div key={column.sortKey}>
									<label>{column.name}</label>
									<Select
										options={
											column.sortKey === "category_primary"
												? Object.keys(categoryMapping).map((option) => ({
														label: option,
														value: option
												  }))
												: Object.values(categoryMapping)
														.flat()
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
											selected.forEach((option) =>
												handleFilterChange(column.sortKey, option, true)
											);
											console.log(selected);

											// Find options that were deselected
											const deselected = curFilters[column.sortKey].filter(
												(option) => !newSelectedOptions.includes(option)
											);
											deselected.forEach((option) =>
												handleFilterChange(column.sortKey, option, false)
											);
											console.log(deselected);
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
				<div style={{ flexGrow: 1, overflowY: "auto" }}>
					<Table.Root variant="surface">
						<Table.Header>
							<Table.Row>
								{columns.map((column) => (
									<Table.ColumnHeaderCell key={column.sortKey}>
										<div style={{ display: "flex", alignItems: "center" }}>
											{column.name}
											<Flex gap="3">
												<Button
													radius="large"
													variant="surface"
													highContrast
													color="orange"
													size="1"
													onClick={() => handleSort(column.sortKey)}
													style={{ marginLeft: "5px" }}
												>
													Sort
												</Button>
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
				{/* ----------- PAGINATION BUTTONS AND OPTIONS -----------*/}
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
							<Button
								color={rowsPerPage === 10 ? "cyan" : "indigo"}
								onClick={() => handleRowsPerPageChange(10)}
							>
								10
							</Button>
						</motion.div>
						<motion.div
							className="mx-[10vw]"
							whileHover={{ scale: 1.05 }}
							transition={{
								type: "spring",
								duration: 0.3
							}}
						>
							<Button
								color={rowsPerPage === 20 ? "cyan" : "indigo"}
								onClick={() => handleRowsPerPageChange(20)}
							>
								20
							</Button>
						</motion.div>
						<motion.div
							className="mx-[10vw]"
							whileHover={{ scale: 1.05 }}
							transition={{
								type: "spring",
								duration: 0.3
							}}
						>
							<Button
								color={rowsPerPage === 50 ? "cyan" : "indigo"}
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
							whileHover={{ scale: 1.05 }}
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
							whileHover={{ scale: 1.05 }}
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
		</div>
	);
}

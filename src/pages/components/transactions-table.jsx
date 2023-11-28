import { useRef, useEffect, useState } from "react";
import React from "react";
import * as Select from "@radix-ui/react-select";
import { Flex, Button, Table } from "@radix-ui/themes";
import { motion } from "framer-motion";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { MultiSelect } from "react-multi-select-component";

//TODO: Add search
//TODO: Add filtering for all columns

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
	const [showPrimaryCategoryCheckboxes, setShowPrimaryCategoryCheckboxes] =
		useState(false);
	const [showDetailedCategoryCheckboxes, setShowDetailedCategoryCheckboxes] =
		useState(false);
	const categoryMapping = {
		"Income": [
			"Dividends",
			"Interest Earned",
			"Retirement Pension",
			"Tax Refund",
			"Unemployment",
			"Wages",
			"Other Income"
		],
		"Transfer In": [
			"Cash Advances and Loans",
			"Deposit",
			"Investment and Retirement Funds",
			"Savings",
			"Account Transfer",
			"Other Transfer In"
		],
		"Transfer Out": [
			"Investment and Retirement Funds",
			"Savings",
			"Withdrawal",
			"Account Transfer",
			"Other Transfer Out"
		],
		"Loan Payments": [
			"Car Payment",
			"Credit Card Payment",
			"Personal Loan Payment",
			"Mortgage Payment",
			"Student Loan Payment",
			"Other Payment"
		],
		"Bank Fees": [
			"ATM Fees",
			"Foreign Transaction Fees",
			"Insufficient Funds",
			"Interest Charge",
			"Overdraft Fees",
			"Other Bank Fees"
		],
		"Entertainment": [
			"Casinos and Gambling",
			"Music and Audio",
			"Sporting Events Amusement Parks and Museums",
			"TV and Movies",
			"Video Games",
			"Other Entertainment"
		],
		"Food and Drink": [
			"Beer Wine and Liquor",
			"Coffee",
			"Fast Food",
			"Groceries",
			"Restaurants",
			"Vending Machines",
			"Other food and drink"
		],
		"General Merchandise": [
			"Bookstores and Newsstands",
			"Clothing and Accessories",
			"Convenience Stores",
			"Department Stores",
			"Discount Stores",
			"Electronics",
			"Gifts and Novelties",
			"Office Supplies",
			"Online Marketplaces",
			"Pet Supplies",
			"Sporting Goods",
			"Superstores",
			"Tobacco and Vape",
			"Other General Merchandise"
		],
		"Home Improvement": [
			"Furniture",
			"Hardware",
			"Repair and Maintenance",
			"Security",
			"Other Home Improvement"
		],
		"Medical": [
			"Dental Care",
			"Eye Care",
			"Nursing Care",
			"Pharmacies and Supplements",
			"Primary Care",
			"Veterinary Services",
			"Other Medical"
		],
		"Personal Care": [
			"Gyms and Fitness Centers",
			"Hair and Beauty",
			"Laundry and Dry Cleaning",
			"Other Personal Care"
		],
		"General Services": [
			"Accounting and Financial Planning",
			"Automotive",
			"Childcare",
			"Consulting and Legal",
			"Education",
			"Insurance",
			"Postage and Shipping",
			"Storage",
			"Other General Services"
		],
		"Government and Non Profit": [
			"Donations",
			"Government Departments and Agencies",
			"Tax Payment",
			"Other Government and Non Profit"
		],
		"Transportation": [
			"Bikes and Scooters",
			"Gas",
			"Parking",
			"Public Transit",
			"Taxis and Ride Shares",
			"Tolls",
			"Other Transportation"
		],
		"Travel": ["Flights", "Lodging", "Rental Cars", "Other Travel"],
		"Rent and Utilities": [
			"Gas and Electricity",
			"Internet and Cable",
			"Rent",
			"Sewage and Waste Management",
			"Telephone",
			"Water",
			"Other Utilities"
		]
	}; //istg some of these are not capitalized or spelled correctly and its screwing up the filtering

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
				// // If the array of values for the given attribute is empty, delete the attribute key from newFilters
				// if (newFilters[attribute].length === 0) {
				// 	delete newFilters[attribute];
				// }
			}
		}
		setFilters(newFilters);
		getTransactionsData({
			sort_by: sortAttribute,
			order: sortOrder[sortAttribute],
			rowsPerPage: rowsPerPage,
			filters: newFilters
		});
	};

	const handleAllFilterChange = (attribute, allornone) => {
		const newFilters = { ...curFilters };
		if (allornone) {
			newFilters[attribute] = Object.keys(categoryMapping);
			console.log(Object.keys(categoryMapping));
		} else {
			newFilters[attribute] = [];
		}
		console.log("handleAllFilterChange newFilters:", newFilters);
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
								{columns.map((column) => (
									<Table.ColumnHeaderCell key={column.sortKey}>
										<div style={{ display: "flex", alignItems: "center" }}>
											{column.name === "Primary Category" ||
											column.name === "Detailed Category" ? (
												<button
													onClick={() =>
														column.name === "Primary Category"
															? setShowPrimaryCategoryCheckboxes(
																	!showPrimaryCategoryCheckboxes
															  )
															: setShowDetailedCategoryCheckboxes(
																	!showDetailedCategoryCheckboxes
															  )
													}
												>
													{column.name}
												</button>
											) : (
												column.name
											)}
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
											{showPrimaryCategoryCheckboxes &&
												column.name === "Primary Category" && (
													// <div className="absolute top-full mt-2 w-full bg-white shadow-lg z-10">
													<div>
														<button
															onClick={() =>
																handleAllFilterChange("category_primary", true)
															}
														>
															Select All
														</button>
														<button
															onClick={() =>
																handleAllFilterChange("category_primary", false)
															}
														>
															Select None
														</button>
														{/* {Object.keys(categoryMapping).map((category) => (
															<div key={category} className="flex items-center">
																<Checkbox.Root
																	className="shadow-blackA4 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]"
																	checked={curFilters.category_primary?.includes(
																		category
																	)}
																	onCheckedChange={(checked) =>
																		handleFilterChange(
																			"category_primary",
																			category,
																			checked
																		)
																	}
																	id={category}
																>
																	<Checkbox.Indicator className="text-violet11">
																		<CheckIcon />
																	</Checkbox.Indicator>
																</Checkbox.Root>
																<label
																	className="pl-[15px] leading-none"
																	htmlFor={category}
																>
																	{category}
																</label>
															</div>
														))} */}
														<MultiSelect
															options={Object.keys(categoryMapping).map(
																(category) => ({
																	label: category,
																	value: category
																})
															)}
															value={Object.keys(curFilters).map((filter) => ({
																label: filter,
																value: filter
															}))}
															onChange={(selectedOptions) =>
																handleFilterChange(
																	selectedOptions.map((option) => option.value)
																)
															}
															hasSelectAll
															labelledBy="Select"
														/>
													</div>
												)}
											{showDetailedCategoryCheckboxes &&
												column.name === "Detailed Category" && (
													<div>
														<button
															onClick={() =>
																handleFilterChange(
																	"category_detailed",
																	Object.keys(categoryMapping).flatMap(
																		(key) => categoryMapping[key]
																	),
																	true
																)
															}
														>
															Select All
														</button>
														<button
															onClick={() =>
																handleFilterChange(
																	"category_detailed",
																	Object.keys(categoryMapping).flatMap(
																		(key) => categoryMapping[key]
																	),
																	false
																)
															}
														>
															Select None
														</button>
														{Object.entries(categoryMapping)
															.filter(
																([category]) =>
																	!curFilters.category_primary ||
																	curFilters.category_primary.length === 0 ||
																	curFilters.category_primary.includes(category)
															)
															.map(([category, subcategories]) => (
																<div key={category}>
																	<h3>{category}</h3>
																	{subcategories.map((subcategory) => (
																		<div
																			key={subcategory}
																			className="flex items-center"
																		>
																			<Checkbox.Root
																				className="shadow-blackA4 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]"
																				checked={curFilters.category_detailed?.includes(
																					subcategory
																				)}
																				onCheckedChange={(checked) =>
																					handleFilterChange(
																						"category_detailed",
																						subcategory,
																						checked
																					)
																				}
																				id={subcategory}
																			>
																				<Checkbox.Indicator className="text-violet11">
																					<CheckIcon />
																				</Checkbox.Indicator>
																			</Checkbox.Root>
																			<label
																				className="pl-[15px] leading-none"
																				htmlFor={subcategory}
																			>
																				{subcategory}
																			</label>
																		</div>
																	))}
																</div>
															))}
													</div>
												)}
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

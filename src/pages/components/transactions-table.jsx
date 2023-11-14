import { useRef, useEffect, useState } from "react";
import React from "react";
import * as Select from "@radix-ui/react-select";
import { Flex, Button, Table } from "@radix-ui/themes";
import { motion } from "framer-motion";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

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
	const [showCheckboxes, setShowCheckboxes] = useState(false);
	const categoryMapping = {
		"income": [
			"income dividends",
			"income interest earned",
			"income retirement pension",
			"income tax refund",
			"income unemployment",
			"income wages",
			"income other income"
		],
		"transfer in": [
			"transfer in cash advances and loans",
			"transfer in deposit",
			"transfer in investment and retirement funds",
			"transfer in savings",
			"transfer in account transfer",
			"transfer in other transfer in"
		],
		"transfer out": [
			"transfer out investment and retirement funds",
			"transfer out savings",
			"transfer out withdrawal",
			"transfer out account transfer",
			"transfer out other transfer out"
		],
		"loan payments": [
			"loan payments car payment",
			"loan payments credit card payment",
			"loan payments personal loan payment",
			"loan payments mortgage payment",
			"loan payments student loan payment",
			"loan payments other payment"
		],
		"bank fees": [
			"bank fees atm fees",
			"bank fees foreign transaction fees",
			"bank fees insufficient funds",
			"bank fees interest charge",
			"bank fees overdraft fees",
			"bank fees other bank fees"
		],
		"entertainment": [
			"entertainment casinos and gambling",
			"entertainment music and audio",
			"entertainment sporting events amusement parks and museums",
			"entertainment tv and movies",
			"entertainment video games",
			"entertainment other entertainment"
		],
		"food and drink": [
			"food and drink beer wine and liquor",
			"food and drink coffee",
			"food and drink fast food",
			"food and drink groceries",
			"food and drink restaurant",
			"food and drink vending machines",
			"food and drink other food and drink"
		],
		"general merchandise": [
			"general merchandise bookstores and newsstands",
			"general merchandise clothing and accessories",
			"general merchandise convenience stores",
			"general merchandise department stores",
			"general merchandise discount stores",
			"general merchandise electronics",
			"general merchandise gifts and novelties",
			"general merchandise office supplies",
			"general merchandise online marketplaces",
			"general merchandise pet supplies",
			"general merchandise sporting goods",
			"general merchandise superstores",
			"general merchandise tobacco and vape",
			"general merchandise other general merchandise"
		],
		"home improvement": [
			"home improvement furniture",
			"home improvement hardware",
			"home improvement repair and maintenance",
			"home improvement security",
			"home improvement other home improvement"
		],
		"medical": [
			"medical dental care",
			"medical eye care",
			"medical nursing care",
			"medical pharmacies and supplements",
			"medical primary care",
			"medical veterinary services",
			"medical other medical"
		],
		"personal care": [
			"personal care gyms and fitness centers",
			"personal care hair and beauty",
			"personal care laundry and dry cleaning",
			"personal care other personal care"
		],
		"general services": [
			"general services accounting and financial planning",
			"general services automotive",
			"general services childcare",
			"general services consulting and legal",
			"general services education",
			"general services insurance",
			"general services postage and shipping",
			"general services storage",
			"general services other general services"
		],
		"government and non profit": [
			"government and non profit donations",
			"government and non profit government departments and agencies",
			"government and non profit tax payment",
			"government and non profit other government and non profit"
		],
		"transportation": [
			"transportation bikes and scooters",
			"transportation gas",
			"transportation parking",
			"transportation public transit",
			"transportation taxis and ride shares",
			"transportation tolls",
			"transportation other transportation"
		],
		"travel": [
			"travel flights",
			"travel lodging",
			"travel rental cars",
			"travel other travel"
		],
		"rent and utilities": [
			"rent and utilities gas and electricity",
			"rent and utilities internet and cable",
			"rent and utilities rent",
			"rent and utilities sewage and waste management",
			"rent and utilities telephone",
			"rent and utilities water",
			"rent and utilities other utilities"
		]
	};

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
			newFilters[attribute] = newFilters[attribute].filter(
				(value) => value !== attributeValues
			);
			// If the array of values for the given attribute is empty, delete the attribute key from newFilters
			if (newFilters[attribute].length === 0) {
				delete newFilters[attribute];
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
											<button
												onClick={() => setShowCheckboxes(!showCheckboxes)}
											>
												Primary Category
											</button>

											{showCheckboxes && (
												<div>
													{Object.keys(categoryMapping).map((category) => (
														<div className="flex items-center">
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
																htmlFor="c1"
															>
																{category}
															</label>
														</div>
													))}
												</div>
											)}
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
			) : (
				<p>No transactions found.</p>
			)}
		</div>
	);
}

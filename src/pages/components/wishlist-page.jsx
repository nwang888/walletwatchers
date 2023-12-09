import WishlistTable from "./wishlist-table";
import React, { useEffect, useState, useRef } from "react";
import { Flex, Table, Button, TextField } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

import "@radix-ui/colors/gray.css";
import { SandboxIncomeFireWebhookRequestVerificationStatusEnum } from "plaid";

export async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const db = await open({
                filename: "./sql/big.db",
                driver: sqlite3.Database,
            });

            const accountBalance = await db.get(
                "SELECT account_balance FROM Accounts"
            );
            await db.close();

            return res.status(200).json(accountBalance);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}

export default function WishlistsPage() {
    const [wishlist, setWishlist] = useState([]);
    const [priceTextBox, setPriceTextBox] = useState("");
    const [nameTextBox, setNameTextBox] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [name, setName] = useState([]);
    const [price, setPrice] = useState([]);
    const [id, setID] = useState([]);
    const [totalBalance, setTotalBalance] = useState(-1);
    const [remainingBalances, setRemainingBalances] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    const getWishlistData = async ({
        sort_by = "wishlist_id",
        order = "asc",
        page = currentPage,
        rowsPerPage = 10,
        paginate = true,
    } = {}) => {
        console.log("new page from get end: ", page);
        const response = await fetch(
            `/api/wishlist?sort_by=${sort_by}&order=${order}&page=${page}&rowsPerPage=${rowsPerPage}&paginate=${paginate}`
        );
        const payload = await response.json();

        let remainingBalances = [];
        remainingBalances.push(totalBalance);

        for (let i = 0; i < payload.wishlists.length; i++) {
            totalPrice += payload.wishlists[i].item_price;
            remainingBalances.push(
                remainingBalances[i] - payload.wishlists[i].item_price
            );
        }

        setTotalPrice(totalPrice);
        setRemainingBalances(remainingBalances);
        setWishlist(payload.wishlists);
        console.log("getwishlist balance: ", totalBalance);
        console.log("payload: ", payload);
        setTotalRows(payload.totalRows);
    };

    const postWishlistData = async () => {
        setRemainingBalances(totalBalance);
        const dataToSend = {
            name: nameTextBox,
            price: priceTextBox,
        };
        getWishlistData(1, rowsPerPage);
        const newRemainingBalance =
            remainingBalances[remainingBalances.length - 1] - priceTextBox;

        setRemainingBalances([...remainingBalances, newRemainingBalance]);

        // totalPrice += price[id];

        console.log("sending data: ", dataToSend);
        console.log("post request sent");

        const res = await fetch("/api/wishlist/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });
        setWishlist(res.json());
        getWishlistData(1, rowsPerPage);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        console.log("new page: ", newPage);
        getWishlistData({
            sort_by: "wishlist_id",
            order: "asc",
            page: newPage,
            rowsPerPage: 10,
            paginate: true,
        });
    };

    const [refreshTableKey, setRefreshTableKey] = useState(0);
    const handleAddButton = (event) => {
        const pp = parseFloat(priceTextBox);

        if (isNaN(pp)) {
            alert("Price must be a valid number");
            return;
        }
        if (nameTextBox.trim() === "") {
            alert("Name must not be empty");
            return;
        }
        event.preventDefault();
        postWishlistData();
        setNameTextBox("");
        setPriceTextBox("");

        setRefreshTableKey((prevKey) => prevKey + 1);
    };

    const handleRemove = async (id) => {
        const response = await fetch(`/api/wishlist?id=${id}`, {
            method: "DELETE",
        });

        getWishlistData({
            sort_by: "wishlist_id",
            order: "asc",
            page: 1,
            rowsPerPage: 10,
            paginate: true,
        });

        if (response.ok) {
            setWishlist(wishlist.filter((item) => item.id !== id));
        } else {
            console.error("Failed to remove item");
        }
    };

    const handleLike = async (id) => {
        const response = await fetch(`/api/wishlist?id=${id}`, {
            method: "PUT",
        });
        setWishlist(response);

        // const [likedStatus, setLikedStatus] = useState(false);

        // for (let i = 0; i < wishlist; i++) {
        //     if (wishlist[i].wishlist_id === id) {
        //         setLikedStatus(!likedStatus);
        //     }
        // }
        getWishlistData({
            sort_by: "wishlist_id",
            order: "asc",
            page: 1,
            rowsPerPage: 10,
            paginate: true,
        });
    };

    useEffect(() => {
        console.log("WishlistPage component mounted");
        fetch("/api/account")
            .then((response) => response.json())
            .then((data) => {
                const sum = data.reduce(
                    (total, account) => total + Number(account.account_balance),
                    0
                );
                console.log(sum);
                setTotalBalance(sum);
                console.log("total balance here:" + totalBalance);

                // getWishlistData({
                //     sort_by: "wishlist_id",
                //     order: "asc",
                //     page: 1,
                //     rowsPerPage: 10,
                //     paginate: true,
                // });
                // console.log("total balance: ", totalBalance);
            })
            .catch((error) => {
                console.error("Error fetching account data:", error);
            });
    }, []);

    useEffect(() => {
        getWishlistData({
            sort_by: "wishlist_id",
            order: "asc",
            page: 1,
            rowsPerPage: 10,
            paginate: true,
        });
        console.log("total balance: ", totalBalance);
    }, [totalBalance]);

    return (
        <>
            <div className="text-neutral-800 text-xl font-semibold leading-7 self-stretch mb-4">
                Wishlist
            </div>
            <h1 className="mb-4">Enter items into your wishlist</h1>
            <div className="flex items-center mb-4">
                <label htmlFor="name" className="mr-2">
                    Item name:
                </label>
                <TextField.Root className="w-1/3">
                    <TextField.Slot></TextField.Slot>
                    <TextField.Input
                        id="name"
                        placeholder="Name"
                        value={nameTextBox}
                        onChange={(event) => setNameTextBox(event.target.value)}
                        className="w-full ml-3"
                    />
                </TextField.Root>
            </div>
            <div className="flex items-center mb-4">
                <label htmlFor="price" className="mr-2">
                    Price:
                </label>
                <TextField.Root className="w-1/3 ml-10">
                    <TextField.Slot></TextField.Slot>
                    <TextField.Input
                        id="price"
                        placeholder="Price"
                        value={priceTextBox}
                        onChange={(event) =>
                            setPriceTextBox(event.target.value)
                        }
                        className="w-full ml-3"
                    />
                </TextField.Root>
            </div>
            <div className="items-center mb-8">
                <Button
                    radius="large"
                    variant="surface"
                    highContrast
                    color="orange"
                    size="1"
                    onClick={handleAddButton}
                    style={{ marginLeft: "5px" }}
                >
                    {" "}
                    Add{" "}
                </Button>
            </div>

            <div className="flex justify-between space-x-4">
                {/* Total Balances Card */}
                <div className="bg-primary-light p-4 rounded-md mb-8 w-1/4">
                    <h2 className="text-xl text-center font-bold mb-2">
                        Total Balance
                    </h2>
                    <p className="text-l text-center">${totalBalance}</p>
                </div>

                {/* Total Items Card */}
                <div className="bg-secondary-light p-4 rounded-md mb-8 w-1/4">
                    <h2 className="text-xl text-center font-bold mb-2">
                        Total Items
                    </h2>
                    <p className="text-l text-center">{wishlist.length}</p>
                </div>

                {/* Total Price Card */}
                <div className="bg-accent-light p-4 rounded-md mb-8 w-1/4">
                    <h2 className="text-xl text-center font-bold mb-2">
                        Total Price
                    </h2>
                    <p className="text-l text-center">${totalPrice}</p>
                </div>

                {/* Average Price Card */}
                <div className="bg-primary-hover p-4 rounded-md mb-8 w-1/4">
                    <h2 className="text-xl text-center font-bold mb-2">
                        Average Price
                    </h2>
                    <p className="text-l text-center">
                        ${Math.trunc(totalPrice / totalRows, 2)}
                    </p>
                </div>
            </div>

            <div>
                {wishlist && wishlist.length > 0 ? (
                    <div style={{ flexGrow: 1, overflowY: "auto" }}>
                        <Table.Root variant="surface">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        ></div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Name
                                        </div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Price
                                        </div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Remaining Balance
                                        </div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Progress
                                        </div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Liked
                                        </div>
                                    </Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {wishlist.map((wishlist, idx) => (
                                    <Table.Row key={idx}>
                                        <Table.Cell>
                                            <Button
                                                radius="large"
                                                variant="surface"
                                                highContrast
                                                color="orange"
                                                size="1"
                                                onClick={() =>
                                                    handleRemove(id[idx])
                                                }
                                                style={{ marginLeft: "5px" }}
                                            >
                                                {" "}
                                                Remove{" "}
                                            </Button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {wishlist.item_name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {wishlist.item_price}
                                        </Table.Cell>
                                        <Table.Cell>
                                            $
                                            {Math.max(
                                                remainingBalances[idx] -
                                                    wishlist.item_price,
                                                0
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {" "}
                                            <progress
                                                value={remainingBalances[idx]}
                                                max={wishlist.item_price}
                                            />{" "}
                                            <h1>
                                                {Math.trunc(
                                                    Math.min(
                                                        (totalBalance /
                                                            wishlist.item_price) *
                                                            100,
                                                        100
                                                    ),
                                                    2
                                                )}
                                                %, ${wishlist.item_price} / $
                                                {Math.max(
                                                    remainingBalances[idx],
                                                    0
                                                )}{" "}
                                            </h1>{" "}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {" "}
                                            {/* <Button
                                                onClick={() =>
                                                    handleLike(
                                                        wishlist.wishlist_id
                                                    )
                                                }
                                                style={{
                                                    backgroundColor:
                                                        wishlist.liked
                                                            ? "red"
                                                            : "blue",
                                                }}
                                            >
                                                {wishlist.liked
                                                    ? "Unfavorite"
                                                    : "Favorite"}
                                            </Button> */}{" "}
                                            <button
                                                onClick={() =>
                                                    handleLike(
                                                        wishlist.wishlist_id
                                                    )
                                                }
                                                style={{
                                                    backgroundColor:
                                                        "transparent",
                                                    border: "none",
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        wishlist.liked
                                                            ? solidHeart
                                                            : regularHeart
                                                    }
                                                    color={
                                                        wishlist.liked
                                                            ? "red"
                                                            : "grey"
                                                    }
                                                />
                                            </button>{" "}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                        <div className="pt-5 items-center justify-center"></div>
                        <div>
                            <Flex
                                style={{
                                    paddingTop: "20px",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{
                                        type: "spring",
                                        duration: 0.3,
                                    }}
                                >
                                    <Button
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                </motion.div>
                                <div style={{ margin: "0 10px" }}>
                                    Page {currentPage} /{" "}
                                    {Math.ceil(totalRows / 10)}{" "}
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{
                                        type: "spring",
                                        duration: 0.3,
                                    }}
                                >
                                    <Button
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={
                                            currentPage ===
                                            Math.ceil(totalRows / 10)
                                        }
                                    >
                                        Next
                                    </Button>
                                </motion.div>
                            </Flex>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>No items found.</p>
                    </div>
                )}
            </div>
            {/* <WishlistTable key={refreshTableKey} /> */}
        </>
    );
}

import React, { useEffect, useState, useRef } from "react";
import { Flex, Table, Button, TextField } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import "@radix-ui/colors/gray.css";
import { SandboxIncomeFireWebhookRequestVerificationStatusEnum } from "plaid";
import { HeartIcon } from "@radix-ui/react-icons";

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

export default function WishlistsPage(cards_only = false) {
    cards_only = cards_only.cards_only;
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

    // Gets wishlist data from api/wishlist
    const getWishlistData = async ({
        sort_by = "wishlist_id",
        order = "asc",
        page = currentPage,
        rowsPerPage = 10,
        paginate = true,
    } = {}) => {
        const response = await fetch(
            `/api/wishlist?sort_by=${sort_by}&order=${order}&page=${page}&rowsPerPage=${rowsPerPage}&paginate=${paginate}`
        );
        const payload = await response.json();

        let remainingBalances = [];

        //Calculates remainingBalance depending on the current page number
        remainingBalances.push(totalBalance - payload.priceBeforePage);
        totalPrice = 0;

        for (let i = 0; i < payload.wishlists.length; i++) {
            totalPrice += payload.wishlists[i].item_price;
            remainingBalances.push(
                remainingBalances[i] - payload.wishlists[i].item_price
            );
        }

        setTotalPrice(totalPrice);
        setRemainingBalances(remainingBalances);
        setWishlist(payload.wishlists);
        setTotalRows(payload.totalRows);
        setTotalPrice(payload.totalPrice);
    };

    // Handles post request to api/wishlist every time new item is added
    const postWishlistData = async () => {
        setRemainingBalances(totalBalance);
        const dataToSend = {
            name: nameTextBox,
            price: priceTextBox,
        };

        totalPrice += priceTextBox;
        setTotalPrice(totalPrice);

        getWishlistData(1, rowsPerPage);
        const newRemainingBalance =
            remainingBalances[remainingBalances.length - 1] - priceTextBox;

        setRemainingBalances([...remainingBalances, newRemainingBalance]);

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

    // Handles page change every time Next or Previous is pressed
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        getWishlistData({
            sort_by: "wishlist_id",
            order: "asc",
            page: newPage,
            rowsPerPage: 10,
            paginate: true,
        });
    };

    const [refreshTableKey, setRefreshTableKey] = useState(0);
    // Handles add button by calling push request to api/wishlist with text box values
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

    // Handles remove button by calling delete request to api/wishlist with id
    const handleRemove = async (id) => {
        const response = await fetch(`/api/wishlist?id=${id}`, {
            method: "DELETE",
        });

        // totalPrice -= price[id - 1];

        getWishlistData();

        if (response.ok) {
            setWishlist(wishlist.filter((item) => item.id !== id));
        } else {
            console.error("Failed to remove item");
        }
    };

    // Handles like button by calling put request to api/wishlist with id and moves liked items to the top of list
    const handleLike = async (id) => {
        const response = await fetch(`/api/wishlist?id=${id}`, {
            method: "PUT",
        });
        setWishlist(response);

        getWishlistData({
            sort_by: "wishlist_id",
            order: "asc",
            page: 1,
            rowsPerPage: 10,
            paginate: true,
        });
    };

    useEffect(() => {
        fetch("/api/account")
            .then((response) => response.json())
            .then((data) => {
                const sum = data.reduce(
                    (total, account) => total + Number(account.account_balance),
                    0
                );
                setTotalBalance(sum);
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
    }, [totalBalance]);

    return cards_only ? (
        <div className="justify-between space-x-0">
            <div className="flex justify-between space-x-4">
                {/* Total Balances Card */}
                <div className="bg-primary-light p-4 rounded-md mb-4 w-1/2">
                    <h2 className="text-xl text-center font-bold mb-2">
                        Total Balance
                    </h2>
                    <p className="text-l text-center">${totalBalance}</p>
                </div>

                {/* Total Items Card */}
                <div className="bg-secondary-light p-4 rounded-md mb-4 w-1/2">
                    <h2 className="text-xl text-center font-bold mb-2">
                        Total Items
                    </h2>
                    <p className="text-l text-center">{wishlist.length}</p>
                </div>
            </div>
            <div className="flex justify-between space-x-4">
                {/* Total Price Card */}
                <div className="bg-accent-light p-4 rounded-md mb-8 w-1/2">
                    <h2 className="text-xl text-center font-bold mb-2">
                        Total Price
                    </h2>
                    <p className="text-l text-center">${totalPrice || 0}</p>
                </div>

                {/* Average Price Card */}
                <div className="bg-primary-hover p-4 rounded-md mb-8 w-1/2">
                    <h2 className="text-xl text-center font-bold mb-2">
                        Average Price
                    </h2>
                    <p className="text-l text-center">
                        ${Math.trunc(totalPrice / totalRows, 2) || 0}
                    </p>
                </div>
            </div>
        </div>
    ) : (
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

                <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddButton} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded">
                    Add Item
                </motion.button>
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
                    <p className="text-l text-center">${totalPrice || 0}</p>
                </div>

                {/* Average Price Card */}
                <div className="bg-primary-hover p-4 rounded-md mb-8 w-1/4">
                    <h2 className="text-xl text-center font-bold mb-2">
                        Average Price
                    </h2>
                    <p className="text-l text-center">
                        ${Math.trunc(totalPrice / totalRows, 2) || 0}
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
                                    <Table.ColumnHeaderCell>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        ></div>
                                    </Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {wishlist.map((wishlist, idx) => (
                                    <Table.Row key={idx}>
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
                                                %, $
                                                {Math.max(
                                                    remainingBalances[idx],
                                                    0
                                                )}{" "}
                                                / ${wishlist.item_price}{" "}
                                            </h1>{" "}
                                        </Table.Cell>
                                        <Table.Cell>
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
                                        <Table.Cell>
                                            <motion.button>
                                                <FontAwesomeIcon 
                                                    icon={faTrashCan}
                                                    className={'text-accent2 hover:text-danger m-auto'} 
                                                    onClick={() => handleRemove(wishlist.wishlist_id)}
                                                    size='2x'
                                                />
                                            </motion.button>

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
                                <motion.button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={currentPage === 1}
                                    className={(currentPage === 1 ? "bg-accent2" : "bg-primary hover:bg-primary-hover") + " text-background text-sm font-semibold mx-3 p-3 rounded-lg transition-all"}
                                >
                                    Prev
                                </motion.button>

                                <div className='my-auto'>
                                    Page {currentPage} /{" "}
                                    {Math.ceil(totalRows / 10)}{" "}
                                </div>

                                <motion.button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={currentPage === Math.ceil(totalRows / 10)}
                                    className={(currentPage === Math.ceil(totalRows / 10) ? "bg-accent2" : "bg-primary hover:bg-primary-hover") + " text-background text-sm font-semibold mx-3 p-3 rounded-lg transition-all"}
                                >
                                    Next
                                </motion.button>
                            </Flex>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>No items found.</p>
                    </div>
                )}
            </div>
        </>
    );
}

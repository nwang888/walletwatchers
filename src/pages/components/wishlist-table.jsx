import React, { useEffect, useState, useRef } from "react";
// import Chart from 'chart.js/auto';
// import Image from 'next/image';
import { Flex, Table, Button, TextField } from "@radix-ui/themes";
import { motion } from "framer-motion";
import "@radix-ui/colors/gray.css";

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

export default function WishlistTable() {
    const [wishlist, setWishlist] = useState([]);
    const [wishlist1, setWishlist1] = useState([]);
    const [nameTextBox, setNameTextBox] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [name, setName] = useState([]);
    const [price, setPrice] = useState([]);
    const [like, setLike] = useState([]);
    const [id, setID] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [remainingBalances, setRemainingBalances] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [likedItems, setLikedItems] = useState([]);
    const [totalRows, setTotalRows] = useState(0);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        getWishlistData(currentPage, parseInt(event.target.value));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        getWishlistData(newPage, rowsPerPage);
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
                getWishlistData("wishlist_id", "asc", 1, 10, true);
                console.log("total balance: ", totalBalance);
            })
            .catch((error) => {
                console.error("Error fetching account data:", error);
            });
    }, []);

    const [WishlistLength, setWishlistLength] = useState(0);
    const getWishlistData = async (
        sort_by = "wishlist_id",
        order = "asc",
        page = 1,
        rowsPerPage = 10,
        paginate = true
    ) => {
        const response = await fetch(
            `/api/wishlist?sort_by=${sort_by}&order=${order}&page=${page}&rowsPerPage=${rowsPerPage}&paginate=${paginate}`
        );
        const payload = await response.json();

        let newId = [];
        let newName = [];
        let newPrice = [];
        let remainingBalances = [];
        remainingBalances.push(totalBalance);

        for (let i = 0; i < payload.length; i++) {
            newId.push(payload[i].wishlist_id);
            newName.push(payload[i].item_name);
            newPrice.push(payload[i].item_price);
            remainingBalances.push(remainingBalances[i] - newPrice[i]);
        }

        // remainingBalances.shift();
        setID(newId);
        setName(newName);
        setPrice(newPrice);
        setRemainingBalances(remainingBalances);

        setWishlist(payload.wishlists);
        console.log("payload: ", payload);
        setTotalRows(payload.totalRows);
    };

    const handleRemove = async (id) => {
        const response = await fetch(`/api/wishlist?id=${id}`, {
            method: "DELETE",
        });

        totalPrice -= price[id - 1];
        getWishlistData();

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
        getWishlistData();
    };

    const handleSortLiked = async () => {
        const response = await fetch(`/api/wishlist?id=${id}`, {
            method: "HEAD",
        });
        setWishlist(response);
        getWishlistData();
    };

    return (
        <>
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
                                            Progress
                                        </div>
                                    </Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {id.map((wishlist, idx) => (
                                    <Table.Row key={id[idx]}>
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
                                            {" "}
                                            <progress
                                                value={remainingBalances[idx]}
                                                max={price[idx]}
                                            />{" "}
                                            <h1>
                                                {Math.trunc(
                                                    Math.min(
                                                        (totalBalance /
                                                            price[idx]) *
                                                            100,
                                                        100
                                                    ),
                                                    2
                                                )}
                                                %, ${price[idx]} / $
                                                {Math.max(
                                                    remainingBalances[idx],
                                                    0
                                                )}{" "}
                                            </h1>{" "}
                                        </Table.Cell>
                                        <Table.Cell> {totalRows} </Table.Cell>
                                        {/* <Table.Cell> <button onClick={() => handleLike(id[idx])}>
        Favorite
      </button> </Table.Cell> */}
                                        {/* <Table.Cell>{like[idx]}</Table.Cell> */}
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
                                    {Math.ceil(WishlistLength / 10)}{" "}
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
                                            Math.ceil(totalRows / 10) + 1
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

                        {/* {
                        wishlist.map((item, index) => {
                            <div>
                                <p>{item.name}</p>
                            </div>
                        })

                    } */}
                    </div>
                )}
            </div>
        </>
    );
}

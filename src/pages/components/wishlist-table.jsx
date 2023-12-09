import React, { useEffect, useState, useRef} from 'react';
// import Chart from 'chart.js/auto';
// import Image from 'next/image';
import { Flex, Table, Button, TextField } from '@radix-ui/themes';
import { motion } from "framer-motion";
import "@radix-ui/colors/gray.css";  

export  async function handler(req, res) {
  if (req.method === "GET") {
      try {
          const db = await open({
              filename: "./sql/big.db",
              driver: sqlite3.Database
          });

          const accountBalance = await db.get("SELECT account_balance FROM Accounts");
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
      getWishlistData(
        currentPage,
        parseInt(event.target.value)
      );
    };
      
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
      getWishlistData(
        newPage,
        rowsPerPage
      );
    };
    useEffect(() => {
        fetch('/api/account') 
            .then(response => response.json())
            .then(data => { 
                const sum = data.reduce((total, account) => total + Number(account.account_balance), 0);
                setTotalBalance(sum);
                getWishlistData();
                console.log("total balance: ", totalBalance);
              })
              .catch(error => {
                console.error('Error fetching account data:', error);
              });
    }, []);  

    // useEffect(() => {
    //     fetch('/api/wishlist') 
    //         .then(response => response.json())
    //         .then(data => {
    //           // console.log(data);
    //             const sum = data.reduce((total, item) => total + Number(item.item_price), 0); 
    //             setTotalPrice(sum);
    //         });
    // }, []);
  
    const [WishlistLength, setWishlistLength] = useState(0);
    const getWishlistData = async ( 
        page = 1,
        rowsPerPage = 10,
        paginate = true) => {
            const response = await fetch(`/api/wishlist?page=${page}&rowsPerPage=${rowsPerPage}&paginate=${paginate}`);
            const payload = await response.json();
    
            let newId = [];
            let newName = [];
            let newPrice = [];
            let remainingBalances = [];
            remainingBalances.push(totalBalance);
    
            for(let i = 0; i<payload.length;i++){
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
            setTotalRows(payload.totalRows);
      }  
    
    const postWishlistData = async () => {
      // setRemainingBalances(totalBalance);
        const dataToSend = {
            name: nameTextBox,
            price: priceTextBox
        };
        getWishlistData(1, rowsPerPage);
        const newRemainingBalance = remainingBalances[remainingBalances.length - 1] - priceTextBox;

        setRemainingBalances([...remainingBalances, newRemainingBalance]);
        
        console.log("sending data: ", dataToSend);

        console.log("post request sent");

        const res = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        const data = await res.json();
        getWishlistData(1, rowsPerPage);
    }  

    const handleAddButton = (event) => {
      const pp = parseFloat(priceTextBox);

        if (isNaN(pp)) {
          alert('Price must be a valid number');
          return;
        }
      totalPrice += pp;
      setTotalPrice(totalPrice);
      event.preventDefault();
      postWishlistData();
      setNameTextBox('');
      setPriceTextBox('');
    }

    const [dataFetched, setDataFetched] = useState(false);
 

    useEffect(() => {
      fetch('/api/account')
        .then(response => response.json())
        .then(data => {
          const sum = data.reduce((total, account) => total + Number(account.account_balance), 0);
          setTotalBalance(sum);
          getWishlistData();
        })
        .catch(error => {
          console.error('Error fetching account data:', error);
        });
    }, []);

    const handleRemove = async (id) => {
      const response = await fetch(`/api/wishlist?id=${id}`, {
        method: 'DELETE'
      });

      totalPrice -= price[id-1];
      getWishlistData();
    
      if (response.ok) {
        setWishlist(wishlist.filter(item => item.id !== id));
      } else {
        console.error('Failed to remove item');
      }
    };

    const handleLike = async (id) => {
      const response = await fetch(`/api/wishlist?id=${id}`, {
        method: 'PUT'
      });
      setWishlist(response);
      getWishlistData();
    };

    const handleSortLiked = async () => {
        const response = await fetch(`/api/wishlist?id=${id}`, {
          method: 'HEAD'
        });
        setWishlist(response);
        getWishlistData();
      };
      

    return (
        <>
              <div>
              {/* <button onClick={() => handleSortLiked()}> Sort </button> */}
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
                    onChange={(event) => setPriceTextBox(event.target.value)}
                    className="w-full ml-3"
                  />
                </TextField.Root>
              </div>     
              <div className="items-center mb-8"> 
                        <Button radius="large"
                        variant="surface"
                        highContrast
                        color="orange"
                        size="1"
                        onClick={handleAddButton}
                        style={{ marginLeft: "5px" }}> Add </Button>  
              </div>

              <div className="flex justify-between space-x-4">
                {/* Total Balances Card */}
                <div className="bg-primary-light p-4 rounded-md mb-8 w-1/4">
                  <h2 className="text-xl text-center font-bold mb-2">Total Balance</h2>
                  <p className="text-l text-center">${totalBalance}</p>
                </div>

                {/* Total Items Card */}
                <div className="bg-secondary-light p-4 rounded-md mb-8 w-1/4">
                  <h2 className="text-xl text-center font-bold mb-2">Total Items</h2>
                  <p className="text-l text-center">{wishlist.length}</p>
                </div>

                {/* Total Price Card */}
                <div className="bg-accent-light p-4 rounded-md mb-8 w-1/4">
                  <h2 className="text-xl text-center font-bold mb-2">Total Price</h2>
                  <p className="text-l text-center">${totalPrice}</p>
                </div>

                {/* Average Price Card */}
                <div className="bg-primary-hover p-4 rounded-md mb-8 w-1/4">
                  <h2 className="text-xl text-center font-bold mb-2">Average Price</h2>
                  <p className="text-l text-center">${Math.trunc(totalPrice/wishlist.length,2)}</p>
                </div>
              </div>      
              
              {wishlist.length > 0 ? (
                  <div style={{ flexGrow: 1, overflowY: "auto" }}>
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                           
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          Name
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          Price
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          Progress
                        </div>
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header> 
  
                  <Table.Body>  
                    {id.map((wishlist, idx) => (
  
                      <Table.Row key={id[idx]}>
                        <Table.Cell><Button radius="large"
                          variant="surface"
                          highContrast
                          color="orange"
                          size="1"
                          onClick={() => handleRemove(id[idx])}
                          style={{ marginLeft: "5px" }}> Remove </Button></Table.Cell>  
                        <Table.Cell>{name[idx]}</Table.Cell> 
                        <Table.Cell>{price[idx]}</Table.Cell>
                        <Table.Cell> <progress value={remainingBalances[idx]} max={price[idx]} /> <h1>{Math.trunc(Math.min(totalBalance/price[idx]*100, 100), 2)}%, ${price[idx]} / ${Math.max(remainingBalances[idx],0)} </h1> </Table.Cell>
                        <Table.Cell> {totalRows} </Table.Cell>
                        {/* <Table.Cell> <button onClick={() => handleLike(id[idx])}>
        Favorite
      </button> </Table.Cell> */}
      {/* <Table.Cell>{like[idx]}</Table.Cell> */}
                    </Table.Row>
                    ))} 
                  </Table.Body>
                </Table.Root>
                <div className="pt-5 items-center justify-center">
  
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
                                  Page {currentPage} / {Math.ceil((WishlistLength / 10))}{" "}
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
                                      disabled={currentPage === Math.ceil(totalRows / 10) + 1}
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
  
  };
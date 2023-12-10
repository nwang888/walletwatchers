import WishlistTable from "./wishlist-table";
import React, { useEffect, useState, useRef} from 'react';
import { Table, Button, TextField } from '@radix-ui/themes';
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

export default function WishlistsPage({wishlist, 
										setWishlist, 
										nameTextBox, 
										setNameTextBox,
										priceTextBox,
										setPriceTextBox,
										currentPage,
										setCurrentPage,
										rowsPerPage,
										setRowsPerPage,
										name,
										setName,
										price,
										setPrice,
										id,
										setID,
										totalBalance,
										setTotalBalance,
										remainingBalances,
										setRemainingBalances,
										totalPrice,
										setTotalPrice}) {


	const getWishlistData = async ( 
		page = 1,
		rowsPerPage = 10,
		paginate = true) => {
        const response = await fetch(`/api/wishlist?page=${page}&rowsPerPage=${rowsPerPage}&paginate=${paginate}`);
        const payload = await response.json();

      totalBalance = 300;

        
    
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
        
        remainingBalances.shift();
        setID(newId); 
        setName(newName);
        setPrice(newPrice);
        setRemainingBalances(remainingBalances);
        
        setWishlist(payload);
    }
    
    const postWishlistData = async () => {
      setRemainingBalances(totalBalance);
        const dataToSend = {
            name: nameTextBox,
            price: priceTextBox
        };
        getWishlistData(1, rowsPerPage);
        const newRemainingBalance = remainingBalances[remainingBalances.length - 1] - priceTextBox;

        setRemainingBalances([...remainingBalances, newRemainingBalance]);
        
        console.log("sending data: ", dataToSend);
        console.log("post request sent");

        const res = await fetch('/api/wishlist/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (res.ok) {
          setWishlist([...wishlist, { name: nameTextBox, price: priceTextBox }]);
    
          getWishlistData(1, rowsPerPage);
        } else {
          console.error('Failed to add item to wishlist');
        }
    }  

  const [refreshTableKey, setRefreshTableKey] = useState(0);
  const handleAddButton = (event) => {
    const pp = parseFloat(priceTextBox);

      if (isNaN(pp)) {
        alert('Price must be a valid number');
        return;
      }
    event.preventDefault();
    postWishlistData();
    setNameTextBox('');
    setPriceTextBox('');

    setRefreshTableKey((prevKey) => prevKey + 1);
  }

  // useEffect(() => {
  //   getWishlistData();
  //   }, []);

	// useEffect(() => {
  //       fetch('/api/wishlist') // Assuming '/api/wishlist' returns your data
  //           .then(response => response.json())
  //           .then(data => setWishlist(data));
  //   }, []);
	
	useEffect(() => {
        fetch('/api/account') 
            .then(response => response.json())
            .then(data => { 
                const sum = data.reduce((total, account) => total + Number(account.account_balance), 0);
                setTotalBalance(sum);

                getWishlistData();
            });
    }, []);  

  useEffect(() => {
      fetch('/api/wishlist') 
          .then(response => response.json())
          .then(data => {
            console.log(data);
              const sum = data.reduce((total, item) => total + Number(item.item_price), 0); 
              setTotalPrice(sum);
           });
    }, []);
	
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
        <div className="bg-purple-200 p-4 rounded-md mb-8 w-1/4">
          <h2 className="text-xl text-center font-bold mb-2">Total Balance</h2>
          <p className="text-l text-center">${totalBalance}</p>
        </div>

        {/* Total Items Card */}
        <div className="bg-blue-200 p-4 rounded-md mb-8 w-1/4">
          <h2 className="text-xl text-center font-bold mb-2">Total Items</h2>
          <p className="text-l text-center">{wishlist.length}</p>
        </div>

        {/* Total Price Card */}
        <div className="bg-green-200 p-4 rounded-md mb-8 w-1/4">
          <h2 className="text-xl text-center font-bold mb-2">Total Price</h2>
          <p className="text-l text-center">${totalPrice}</p>
        </div>

        {/* Average Price Card */}
        <div className="bg-yellow-200 p-4 rounded-md mb-8 w-1/4">
          <h2 className="text-xl text-center font-bold mb-2">Average Price</h2>
          <p className="text-l text-center">${Math.trunc(totalPrice/wishlist.length,2)}</p>
        </div>
      </div>      
      
      <WishlistTable key={refreshTableKey}/>
		</>
	);
	
}
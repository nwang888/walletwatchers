import WishlistTable from "./wishlist-table";
import React, { useEffect, useState, useRef} from 'react';

import { Table, Button, TextField } from '@radix-ui/themes';

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
										nameTextbox, 
										setNameTextbox,
										priceTextbox,
										setPriceTextbox,
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
    // const [wishlist, setWishlist] = useState([]);
    // const [nameTextBox, setNameTextBox] = useState("");
    // const [priceTextBox, setPriceTextBox] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [name, setName] = useState([]);
    // const [price, setPrice] = useState([]);
    // const [id, setID] = useState([]);
    // const [totalBalance, setTotalBalance] = useState(0);
    // const [remainingBalances, setRemainingBalances] = useState([]);
    // const [totalPrice, setTotalPrice] = useState(0);


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

        // Add the new remaining balance to the array
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

        const data = await res.json();
        getWishlistData(1, rowsPerPage);

        setWishlist([...wishlist, {name: "hi", price:" 5"}]);
    }  


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
	  }
	  const fetchData = async () => {
		const response = await fetch('https://example.com/api/data');
		const json = await response.json();
		setData(json);
	  };

	useEffect(() => {
		getWishlistData();
		fetchData();
		}, []);

	useEffect(() => {
        fetch('/api/wishlist') // Assuming '/api/wishlist' returns your data
            .then(response => response.json())
            .then(data => setWishlist(data));
    }, []);
	
	useEffect(() => {
        fetch('/api/account') 
            .then(response => response.json())
            .then(data => { 
                const sum = data.reduce((total, account) => total + Number(account.account_balance), 0);
                setTotalBalance(sum);
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
			<div className="text-neutral-800 text-xl font-semibold leading-7 self-stretch">
          Wishlist
        </div>
          <h1>Enter items into your wishlist  </h1>
          <div>
              <label for="name">Item name:</label>   
              <TextField.Root style={{ width: '40%' }} >
                <TextField.Slot>
                </TextField.Slot>
                <TextField.Input 
                  id="name" 
                  placeholder="Name"
                  value= {nameTextBox} 
                  onChange={(event) => setNameTextBox(event.target.value)}/>
              </TextField.Root> 
              <label for="name"> Price:</label>
              <TextField.Root
              style={{ width: '40%' }} >
                <TextField.Slot>
                </TextField.Slot>
                <TextField.Input 
                  id="price" 
                  placeholder="Price"
                  value= {priceTextBox} 
                  onChange={(event) => setPriceTextBox(event.target.value)} />
              </TextField.Root> 
            
              {/* <button onClick={getWishlistData}> Update </button> */}
                <Button radius="large"
                variant="surface"
                highContrast
                color="orange"
                size="1"
                onClick={handleAddButton}
                style={{ marginLeft: "5px" }}> Add </Button>  
            </div> 
			<WishlistTable walletId={walletId} />;
		</>
	);
	
}

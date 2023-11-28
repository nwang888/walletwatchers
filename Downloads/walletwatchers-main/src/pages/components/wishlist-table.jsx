
import React, { useEffect, useState, useRef} from 'react';
// import Chart from 'chart.js/auto';
// import Image from 'next/image';
import { Table, Button, TextField } from '@radix-ui/themes';

  //       return an error if price value is not a double, also reset both textbox values to empty string '' after submit button is pressed 
  
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

export default function WishlistTable({ balance }) {
    const [wishlist, setWishlist] = useState([]);
    const [nameTextBox, setNameTextBox] = useState("");
    const [priceTextBox, setPriceTextBox] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [name, setName] = useState([]);
    const [price, setPrice] = useState([]);
    const [id, setID] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [remainingBalances, setRemainingBalances] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

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

    useEffect(() => {
      getWishlistData();
      }, []);

    useEffect(() => {
        fetch('/api/wishlist') // Assuming '/api/wishlist' returns your data
            .then(response => response.json())
            .then(data => setWishlist(data));
    }, []);

    const handleRemove = async (id) => {
      const response = await fetch(`/api/wishlist?id=${id}`, {
        method: 'DELETE'
      });

      getWishlistData();
    
      if (response.ok) {
        // Remove the item from the state
        setWishlist(wishlist.filter(item => item.id !== id));
      } else {
        console.error('Failed to remove item');
      }
    };

    return (
      <>

            

            <div>
            {wishlist.length > 0 ? (
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
                      <Table.Cell><button onClick={() => handleRemove(id[idx])}>Remove</button></Table.Cell>  
                      <Table.Cell>{name[idx]}</Table.Cell>
                      <Table.Cell>{price[idx]}</Table.Cell>
                      <Table.Cell> <progress value={totalBalance} max={price[idx]} /> <h1>{Math.trunc(Math.min(totalBalance/price[idx]*100, 100), 2)}%, ${totalBalance} / ${price[idx]} </h1></Table.Cell>
                      <Table.Cell>  {remainingBalances[idx]} </Table.Cell>
                    </Table.Row>
                  ))} 
                </Table.Body>
              </Table.Root>

              
            ) : (
              <p>No transactions found.</p>
            )} 

            <label>
              Rows per page:
              <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
            </div>
            </>
    );
  };
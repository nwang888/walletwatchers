import React, { useEffect, useState, useRef} from 'react';
// import * as radix from '@radix-ui';
// import 'node_modules/@radix-ui/react-progress/dist/index.css';
// import './style.css';
import Chart from 'chart.js/auto';
import Image from 'next/image';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Rating from '@mui/material/Rating';
// import { TextInput } from '@radix-ui/react-text-input';
import { Table } from '@radix-ui/themes';


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

export default function WishlistPage({ balance }) {

    const [nameTextBox, setNameTextBox] = useState("");
    const [priceTextBox, setPriceTextBox] = useState(0);

    const [name, setName] = useState([]);
    const [price, setPrice] = useState([]);
    const [id, setID] = useState([]);

    const [totalBalance, setTotalBalance] = useState(0);
 
  //   useEffect(() => {
  //     fetch('/api/accounts')
  //         .then(response => response.json())
  //         .then(data => setTotalBalance(data.account_balance));
  // }, []);

    useEffect(() => {
        fetch('/api/account') // Assuming '/api/wishlist' returns your data
            .then(response => response.json())
            .then(data => { 
                const sum = data.reduce((total, account) => total + Number(account.account_balance), 0);
                setTotalBalance(sum);
            });
    }, []);  

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        fetch('/api/wishlist') // Assuming '/api/wishlist' returns your data
            .then(response => response.json())
            .then(data => {
                const sum = data.reduce((total, item) => total + Number(item.item_price), 0);
                setTotalPrice(sum);
            });
    }, []);
  
 
    const getWishlistData = async () => {
        const response = await fetch('/api/wishlist');
        const payload = await response.json();
    
        let newId = [];
        let newName = [];
        let newPrice = [];
        
        for(let i = 0; i<payload.length;i++){
            newId.push(payload[i].wishlist_id);
            newName.push(payload[i].item_name);
            newPrice.push(payload[i].item_price);
        }
    
        setID(newId);
        setName(newName);
        setPrice(newPrice);
        
    }
    
    const postWishlistData = async () => {
        const dataToSend = {
            name: nameTextBox,
            price: priceTextBox
        };
        
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
        // console.log('Response (from client):', data);
        // console.log(priceTextBox);
    }  

  useEffect(() => {
    getWishlistData();

    const ctx = document.getElementById('progressBar').getContext('2d');
    
    const progressBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Progress'],
        datasets: [{
          label: 'Progress',
          data: [75], 
          // data: [price],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      }, 
      options: {
        indexAxis: 'y',
        scales: { 
          y: {
            beginAtZero: true,
            max: 100 // This represents 100%
          }
        }
      }
     });

     



     
  }, []);

 
  
  //website
  // const [progress, setProgress] = React.useState(13);

  // React.useEffect(() => {
  //   const timer = setTimeout(() => setProgress(66), 500);
  //   return () => clearTimeout(timer);
  // }, []);


    
const [wishlist, setWishlist] = useState([]);

useEffect(() => {
    fetch('/api/wishlist') // Assuming '/api/wishlist' returns your data
        .then(response => response.json())
        .then(data => setWishlist(data));
}, []);

  return (
    
    <>
    {/* <h1>hi</h1>
    <Progress.Root value={progress}>
       <Progress.Indicator />
     </Progress.Root> */}

   <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>

      
      <h1>Wishlist</h1>
        <p>there's data stored in state that isn't rendered yet</p>
    
     
      <div>
          <label for="name">Name:</label> 
          <input  
            id="name"
              type="text"  
              label = "Name" 
              value= {nameTextBox}
              onChange= {(event) => setNameTextBox(event.target.value)}
          />    
          <input  
                  id="outlined-basic" 
                  type="text"  
                  label = "Price" 
                  value= {priceTextBox} 
                  onChange= {(event) => setPriceTextBox(event.target.value)} 
              /> 
                      <button onClick={getWishlistData}>get wishlist</button>
    
              <button id = "submit-button" onClick={postWishlistData}>Submit</button>
              <h1> {totalBalance} </h1> 
              <h1> {totalPrice} </h1> 
      </div>





          <div>
			{wishlist.length > 0 ? (
				<Table.Root variant="surface">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell>
								<div style={{ display: "flex", alignItems: "center" }}>
									Account
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
              {/* <Table.ColumnHeaderCell>
								<div style={{ display: "flex", alignItems: "center" }}>
									Name
								</div>
							</Table.ColumnHeaderCell> */}
						</Table.Row>
					</Table.Header> 

					<Table.Body>  
						{id.map((item, idx) => (
							<Table.Row key={id[idx]}>
								<Table.RowHeaderCell>
									{id[idx]} 
								</Table.RowHeaderCell>
								<Table.Cell>{name[idx]}</Table.Cell>
								<Table.Cell>{price[idx]}</Table.Cell>
                <Table.Cell> </Table.Cell>
							</Table.Row>
						))} 
					</Table.Body>
				</Table.Root>

        
			) : (
				<p>No transactions found.</p>
			)}

      <canvas id="progressBar"></canvas>  
		</div>
          </>
  );
};
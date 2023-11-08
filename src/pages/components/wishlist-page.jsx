
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
import * as Progress from '@radix-ui/react-progress'
// import './styles.css';
 


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
    const [newItem, setNewItem] = useState({ name: '', price: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [name, setName] = useState([]);
    const [price, setPrice] = useState([]);
    const [id, setID] = useState([]);

    const [totalBalance, setTotalBalance] = useState(0);
 
  //   useEffect(() => {
  //     fetch('/api/accounts')
  //         .then(response => response.json())
  //         .then(data => setTotalBalance(data.account_balance));
  // }, []);
    	const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        getWishlistData(
          currentPage,
          parseInt(event.target.value),
          paginate = true
        );
        page = 1,
		rowsPerPage = 10,
		paginate = true
      };
      
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
      getWishlistsData(
        newPage,
        rowsPerPage
      );
    };

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
  
 
    const getWishlistData = async ( page=1, rowsPerPage = 10 , paginate = true) => {
        const response = await fetch(`/api/wishlist?page=${page}&rowsPerPage=${rowsPerPage}&paginate=${paginate}`);
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
        setWishlist([...wishlist, { name: 'Manual Name', price: 'Manual Price' }]);
    }
    
    const postWishlistData = async () => {
        const dataToSend = {
            name: nameTextBox,
            price: priceTextBox
        };
        getWishlistData();
        setWishlist([...wishlist, {name: "hi", price:" 5"}]);
        
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
        getWishlistData();
        setWishlist([...wishlist, {name: "hi", price:" 5"}]);
    }  

  useEffect(() => {
    getWishlistData();
 
    //fix: https://stackoverflow.com/questions/72153376/multiple-charts-in-one-page-chartjs 
  //   const ctx = document.getElementById('progressBar').getContext('2d');

    
    
  //   const progressBar = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: ['Progress'],
  //       datasets: [{
  //         label: 'Progress',
  //         data: [totalBalance], 
  //         // data: [price],
  //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //         borderColor: 'rgb(75, 192, 192)',
  //         borderWidth: 1
  //       }] 
  //     }, 
  //     options: {
  //       indexAxis: 'y',
  //       scales: { 
  //         y: {
  //           beginAtZero: true,
  //           max: totalPrice // This represents 100%
  //         }
  //       }
  //     }
  //    });

     



     
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

   <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>

      
      <h1>Wishlist</h1>
        
    
     
      <div>
          <label for="name">Name:</label> 
          <input  
            id="name"
              type="text"  
              label = "Name" 
              value= {nameTextBox}
              onChange= {(e) => setNameTextBox(e.target.value)}
          />    
          <input  
                  id="outlined-basic" 
                  type="text"  
                  label = "Price" 
                  value= {priceTextBox} 
                  onChange= {(event) => setPriceTextBox(event.target.value)} 
              /> 
                      {/* <button onClick={getWishlistData}> Update </button> */}
                      <button onClick={postWishlistData}> Add </button>
    
             
      </div> 





          <div>
      {wishlist.length > 0 ? (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Number
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
            {id.map((item, idx) => (
              <Table.Row key={id[idx]}>
                <Table.RowHeaderCell>
                  {id[idx]} 
                </Table.RowHeaderCell>
                <Table.Cell>{name[idx]}</Table.Cell>
                <Table.Cell>{price[idx]}</Table.Cell>
                <Table.Cell> <progress value={totalBalance} max={price[idx]} /> </Table.Cell>
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

    {/* <canvas id="progressBar"></canvas> */}
    {/* <canvas id="progressBar"></canvas> */}
          </>
  );
};
//       return an error if 
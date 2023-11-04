'use client'

import Image from 'next/image';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';

import { useState } from 'react';

export default function WishList() {
  const [data, setData] = useState([]);

  const [nameTextBox, setNameTextBox] = useState("");
  const [priceTextBox, setPriceTextBox] = useState(0);
  const [idTextBox, setIDTextBox] = useState(0);

  const [name, setName] = useState([]);
  const [price, setPrice] = useState([]);
  const [id, setID] = useState([]);

  

  const getData = async () => {
    const response = await fetch('/api/wishlist');
    const payload = await response.json();

    console.log(payload[0]);
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

  const postData = async () => {
    const dataToSend = {
      name: nameTextBox,
      price: priceTextBox
    };

    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    const data = await res.json();
    console.log('Response (from client):', data);
  }

  return (
    <>

        <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={nameTextBox}
            onChange={(event) => {
                setNameTextBox(event.target.value);
            }
        }
        />

        <TextField
            id="outlined-basic"
            label="Price"
            variant="outlined"
            value={priceTextBox}
            onChange={(event) => {
                setPriceTextBox(event.target.value);
            }
        }
        />

        <Button onClick={getData}>get wishlist</Button>
        <Button onClick={postData}>post wishlist</Button>

        {
            id.map((item, idx) => {
                return (
                    <div key={id[idx]}>
                        <h2>{id[idx]}</h2>
                        <h3>{name[idx]}</h3>
                        <h3>{price[idx]}</h3>
                        <hr></hr>
                    </div>

                )
            })
        }
    </>
  )
}

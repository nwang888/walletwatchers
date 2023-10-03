'use client'

import Image from 'next/image';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';

import { useState } from 'react';

export default function getToken() {

  const [data, setData] = useState([]);

  const [token_name, setTokenName] = useState("");
  const [access_token, setAccessToken] = useState("");

  const getData = async () => {
    const response = await fetch('/api/bankdb');
    const payload = await response.json();
    console.log(payload);
    setData(payload);
  }

  const postData = async () => {
    const dataToSend = {
      token_name: token_name,
      access_token: access_token
    };

    const res = await fetch('/api/bankdb', {
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

        <Button variant="contained" onClick={postData}>submit</Button>

        <Rating
            name="simple-controlled"
            value={token_name}
            onChange={(event, newValue) => {
                setTokenName(newValue);
            }
        }
        />

        <TextField
            id="outlined-basic"
            label="food"
            variant="outlined"
            value={access_token}
            onChange={(event) => {
                setFood(event.target.value);
            }
        }
        />

        <Button variant="contained" onClick={getData}>retrieve data</Button>


        {
            data.map((item) => {
                return (
                    <div key={item.token_name}>
                        <h2>{item.token_name}</h2>
                        <h3>{item.access_token}</h3>
                    </div>
                )
            })
        }
    </>
  )
}

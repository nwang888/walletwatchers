'use client'

import Image from 'next/image';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';

import { useState } from 'react';

export default function FoodRating() {

  const [data, setData] = useState([]);

  const [rating, setRating] = useState(0);
  const [food, setFood] = useState("");

  const getData = async () => {
    const response = await fetch('/api/foods');
    const payload = await response.json();
    console.log(payload);
    setData(payload);
  }

  const postData = async () => {
    const dataToSend = {
      food: food,
      rating: rating
    };

    const res = await fetch('/api/foods', {
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
            value={rating}
            onChange={(event, newValue) => {
                setRating(newValue);
            }
        }
        />

        <TextField
            id="outlined-basic"
            label="food"
            variant="outlined"
            value={food}
            onChange={(event) => {
                setFood(event.target.value);
            }
        }
        />

        <Button variant="contained" onClick={getData}>retrieve data</Button>


        {
            data.map((item) => {
                return (
                    <div key={item.food}>
                        <h2>{item.food}</h2>
                        <h3>{item.rating}</h3>
                    </div>
                )
            })
        }
    </>
  )
}

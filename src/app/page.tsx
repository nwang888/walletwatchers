'use client'

import Image from 'next/image';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function Home() {

  const [data, setData] = useState("");

  const getData = async () => {
    const response = await fetch('/api/sql-test');
    const payload = await response.json();
    console.log(payload);
    setData(payload.data);
  }

  const postData = async () => {
    const dataToSend = {
      message: 'i eat potatoes',
      emotion: 'very lovingly'
    };

    const res = await fetch('/api/sql-test', {
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
      <h1>{data}</h1>

      <Button variant="contained" onClick={getData}>get data</Button>

      <Button variant="contained" onClick={postData}>post data</Button>
    </>
  )
}

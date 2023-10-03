'use client'

import Image from 'next/image';
import Button from '@mui/material/Button';
import { useState } from 'react';

import FoodRating from './components/food-rating';
import PlaidLink from './components/plaid-link';

export default function Home() {

  const [data, setData] = useState("");

  return (
    <>
      <PlaidLink />
    </>
  )
}

import { useEffect, useState } from 'react';

export default function NavBar({ setPageNum }) {


  return (
    <>
        <button onClick={() => setPageNum(0)}>
            Home
        </button>

        <button onClick={() => setPageNum(1)}>
            Transactions
        </button>

        <button onClick={() => setPageNum(2)}>
            Wishlist
        </button>
    </>
  )
}
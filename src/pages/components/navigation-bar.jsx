import { useEffect, useState } from 'react';
import { Flex, Button } from '@radix-ui/themes';

export default function NavBar({ setPageNum }) {


  return (
    <>
      <Flex direction="row" gap="3">
        <Button onClick={() => setPageNum(0)}>
            Home
        </Button>

        <Button onClick={() => setPageNum(1)}>
            Transactions
        </Button>

        <Button onClick={() => setPageNum(2)}>
            Wishlist
        </Button>
      </Flex>
    </>
  )
}
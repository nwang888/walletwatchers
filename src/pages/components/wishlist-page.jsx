import { useEffect, useState } from 'react';


export default function WishlistPage({ balance }) {

    const [nameTextBox, setNameTextBox] = useState("");
    const [priceTextBox, setPriceTextBox] = useState(0);

    const [name, setName] = useState([]);
    const [price, setPrice] = useState([]);
    const [id, setID] = useState([]);

    const getWishlistData = async () => {
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
    
    const postWishlistData = async () => {
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

  useEffect(() => {
    getWishlistData();
  }, []);


  console.log(name);

  return (
    <>
      <h1>Wishlist</h1>
        <p>there's data stored in state that isn't rendered yet</p>
    </>
  )
}
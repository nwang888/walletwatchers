import React, { useEffect, useState } from 'react';

import { Table, Button, TextField } from '@radix-ui/themes';

export default function RecurringTransactions() {

    const [merchantTextBox, setMerchantTextBox] = useState('');
    const [priceTextBox, setPriceTextBox] = useState('');

    const [primaryCategory, setPrimaryCategory] = useState('income');
    const [detailedCategory, setDetailedCategory] = useState('income dividends');

    const postTransactionData = async () => {
        // Input validation
        if (!primaryCategory.trim() || !detailedCategory.trim()) {
            alert('Please enter a valid category.');
            return;
        }
        if (!merchantTextBox.trim()) {
            alert('Please enter a valid merchant name.');
            return;
        }
        if (!priceTextBox || isNaN(priceTextBox) || priceTextBox <= 0) {
            alert('Please enter a valid transaction amount.');
            return;
        }
        
        const dataToSend = {
            primary_category: primaryCategory.toUpperCase().replace(/ /g, "_"),
            detailed_category: detailedCategory.toUpperCase().replace(/ /g, "_"),
            merchant_name: merchantTextBox,
            transaction_amount: parseFloat(priceTextBox),
        };
        
        console.log("sending data: ", dataToSend);

        console.log("post request sent");

        const res = await fetch('/api/recurring-transactions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        const data = await res.json();

        return data;
    }
    

    const handleAddButton = (event) => {
        const pp = parseFloat(priceTextBox);
  
        if (isNaN(pp)) {
            alert('Price must be a valid number');
            return;
        }

        event.preventDefault();
        postTransactionData();
        
        setMerchantTextBox('');
        setPriceTextBox('');
        setPrimaryCategory('income');
        setDetailedCategory('income dividends');
    }

    function CategorySelector() {
        const categoryMapping = {
            "income": ["income dividends", "income interest earned", "income retirement pension", "income tax refund", "income unemployment", "income wages", "income other income"], "transfer in": ["transfer in cash advances and loans", "transfer in deposit", "transfer in investment and retirement funds", "transfer in savings", "transfer in account transfer", "transfer in other transfer in"], "transfer out": ["transfer out investment and retirement funds", "transfer out savings", "transfer out withdrawal", "transfer out account transfer", "transfer out other transfer out"], "loan payments": ["loan payments car payment", "loan payments credit card payment", "loan payments personal loan payment", "loan payments mortgage payment", "loan payments student loan payment", "loan payments other payment"], "bank fees": ["bank fees atm fees", "bank fees foreign transaction fees", "bank fees insufficient funds", "bank fees interest charge", "bank fees overdraft fees", "bank fees other bank fees"], "entertainment": ["entertainment casinos and gambling", "entertainment music and audio", "entertainment sporting events amusement parks and museums", "entertainment tv and movies", "entertainment video games", "entertainment other entertainment"], "food and drink": ["food and drink beer wine and liquor", "food and drink coffee", "food and drink fast food", "food and drink groceries", "food and drink restaurant", "food and drink vending machines", "food and drink other food and drink"], "general merchandise": ["general merchandise bookstores and newsstands", "general merchandise clothing and accessories", "general merchandise convenience stores", "general merchandise department stores", "general merchandise discount stores", "general merchandise electronics", "general merchandise gifts and novelties", "general merchandise office supplies", "general merchandise online marketplaces", "general merchandise pet supplies", "general merchandise sporting goods", "general merchandise superstores", "general merchandise tobacco and vape", "general merchandise other general merchandise"], "home improvement": ["home improvement furniture", "home improvement hardware", "home improvement repair and maintenance", "home improvement security", "home improvement other home improvement"], "medical": ["medical dental care", "medical eye care", "medical nursing care", "medical pharmacies and supplements", "medical primary care", "medical veterinary services", "medical other medical"], "personal care": ["personal care gyms and fitness centers", "personal care hair and beauty", "personal care laundry and dry cleaning", "personal care other personal care"], "general services": ["general services accounting and financial planning", "general services automotive", "general services childcare", "general services consulting and legal", "general services education", "general services insurance", "general services postage and shipping", "general services storage", "general services other general services"], "government and non profit": ["government and non profit donations", "government and non profit government departments and agencies", "government and non profit tax payment", "government and non profit other government and non profit"], "transportation": ["transportation bikes and scooters", "transportation gas", "transportation parking", "transportation public transit", "transportation taxis and ride shares", "transportation tolls", "transportation other transportation"], "travel": ["travel flights", "travel lodging", "travel rental cars", "travel other travel"], "rent and utilities": ["rent and utilities gas and electricity", "rent and utilities internet and cable", "rent and utilities rent", "rent and utilities sewage and waste management", "rent and utilities telephone", "rent and utilities water", "rent and utilities other utilities"]
        }
        return (
            <>
                <div>
                    <div className='my-2'>
                        <label className="mr-2">Primary Category:</label>
                        <select className="border rounded" onChange={(event) => setPrimaryCategory(event.target.value)}>
                            {Object.keys(categoryMapping).map((key) => (
                                <option value={key}>{key}</option>
                            ))}
                        </select>
                    </div>

                    <div className='my-2'>
                        <label className="mr-2">Detailed Category:</label>
                        <select className="border rounded" onChange={(event) => setDetailedCategory(event.target.value)}>
                            {primaryCategory && categoryMapping[primaryCategory].map((category) => (
                                <option value={category}>{category}</option>
                            ))}
                        </select>

                    </div>

                </div>
            </>
        )
    }

    function Form() {
        return (
            <>
                <div class='flex-col my-3'>

                    <h1 className='text-2xl font-bold my-3'>Enter Recurring Transactions</h1>

                    <div className='my-2'>
                        <label className="my-2" for="name">Merchant name:</label>   
                        <TextField.Root
                            style={{ width: '40%' }} >
                            <TextField.Slot>
                            </TextField.Slot>
                            <TextField.Input 
                                id="name" 
                                placeholder="Name"
                                value= {merchantTextBox} 
                                onChange={(event) => setMerchantTextBox(event.target.value)}
                            />
                        </TextField.Root>
                    </div>

                    <div className='my-2'>
                        <label className="my-2" for="name">Cost per month:</label>
                        <TextField.Root
                            style={{ width: '40%' }} >
                            <TextField.Slot>
                            </TextField.Slot>
                            <TextField.Input 
                            id="price" 
                            placeholder="Price"
                            value= {priceTextBox} 
                            onChange={(event) => setPriceTextBox(event.target.value)} 
                        />
                        </TextField.Root> 
                    </div>

                    {CategorySelector()}

                    <button 
                        onClick={handleAddButton}
                        className='border-2 border-gray-200 rounded-md p-2 hover:border-gray-300 transition-colors my-3'
                    >Post</button>
                </div>
            </>
        )
    }


    return (
        <>
            {Form()}
        </>
    )
}
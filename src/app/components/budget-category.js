'use client'

import Image from 'next/image';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';

import { useState } from 'react';

export default function BudgetCategory() {

    // budget variables
    const [budgetNameInput, setBudgetNameInput] = useState("");
    const [startDateInput, setStartDateInput] = useState("");
    const [endDateInput, setEndDateInput] = useState("");
    const [budgetAmountInput, setBudgetAmountInput] = useState(0);

    const [budgetID, setBudgetID] = useState([]);
    const [budgetName, setBudgetName] = useState([]);
    const [startDate, setStartDate] = useState([]);
    const [endDate, setEndDate] = useState([]);
    const [budgetAmount, setBudgetAmount] = useState([]);
    
    
    // category variables
    const [categoryNameInput, setCategoryNameInput] = useState("");
    const [categoryBudgetPercentageInput, setCategoryBudgetPercentageInput] = useState(0);

    const [categoryID, setCategoryID] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [categoryBudgetPercentage, setCategoryBudgetPercentage] = useState([]);

  

    const getBudget = async () => {
        console.log("attempting to fetch budget");
        const response = await fetch('/api/budgets');
        const payload = await response.json();

        console.log(payload);
        let newID = [];
        let newName = [];
        let newStartDate = [];
        let newEndDate = [];
        let newBudgetAmount = [];
        
        for(let i = 0; i<payload.length;i++){
            newID.push(payload[i].budget_id);
            newName.push(payload[i].budget_name);
            newStartDate.push(payload[i].start_date);
            newEndDate.push(payload[i].end_date);
            newBudgetAmount.push(payload[i].budget_amount);
            
        }

        setBudgetID(newID);
        setBudgetName(newName);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setBudgetAmount(newBudgetAmount);
    }
    
    const getCategory = async () => {
        console.log("attempting to fetch category");
        const response = await fetch('/api/categories');
        const payload = await response.json();

        console.log(payload[0]);
        let newID = [];
        let newName = [];
        let newPercentage = [];
        
        for(let i = 0; i<payload.length;i++){
            newID.push(payload[i].category_id);
            newName.push(payload[i].category_name);
            newPercentage.push(payload[i].category_budget_percentage);            
        }

        setCategoryID(newID);
        setCategoryName(newName);
        setCategoryBudgetPercentage(newPercentage);
    }

  const postBudget = async () => {

    console.log("hello");
    const dataToSend = {
        "budget_name": budgetNameInput,
        "start_date": startDateInput,
        "end_date": endDateInput,
        "budget_amount": budgetAmountInput
    };

    console.log(dataToSend);

    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    const data = await res.json();
    console.log('Response (from client):', data);
  }

  const postCategory = async () => {
    const dataToSend = {
        "category_name": categoryNameInput,
        "category_budget_percentage": categoryBudgetPercentageInput
    };

    console.log(dataToSend);

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    const data = await res.json();
    console.log('Response (from client):', data);
  }

  function BudgetComponents(props) {
    return (
        <div>
            <TextField
                label="Budget Name"
                variant="outlined"
                value={budgetNameInput}
                onChange={(event) => {
                    setBudgetNameInput(event.target.value);
                }}
            />

            <TextField
                label="Start Date"
                variant="outlined"
                type="date"
                InputLabelProps={{
                shrink: true,
                }}
                value={startDateInput}
                onChange={(event) => {
                setStartDateInput(event.target.value);
                }}
            />

            <TextField
                label="End Date"
                variant="outlined"
                type="date"
                InputLabelProps={{
                shrink: true,
                }}
                value={endDateInput}
                onChange={(event) => {
                setEndDateInput(event.target.value);
                }}
            />

            <TextField
                label="Budget Amount"
                variant="outlined"
                value={budgetAmountInput}
                onChange={(event) => {
                setBudgetAmountInput(event.target.value);
                }}
            />

            <Button variant="contained" onClick={getBudget}>get budgets</Button>
            <Button variant="contained" onClick={postBudget}>post budgets</Button>


            {
                budgetID.map((item, idx) => {
                    return (
                        <div key={budgetID[idx]}>
                            <h2>{budgetName[idx]}</h2>
                            <h3>{startDate[idx]}</h3>
                            <h3>{endDate[idx]}</h3>
                            <h3>{budgetAmount[idx]}</h3>
                            <hr></hr>
                        </div>
                    )
                })
            }
        </div>

    );
  }

  function CategoryComponents(props) {
    return (
        <div>
            <TextField
                label="Category Name"
                variant="outlined"
                value={categoryNameInput}
                onChange={(event) => {
                setCategoryNameInput(event.target.value);
                }}
            />

            <TextField
                label="Category Budget Percentage"
                variant="outlined"
                value={categoryBudgetPercentageInput}
                onChange={(event) => {
                setCategoryBudgetPercentageInput(event.target.value);
                }}
            />

            <Button variant="contained" onClick={getCategory}>get category</Button>
            <Button variant="contained" onClick={postCategory}>post category</Button>

            {
                categoryID.map((item, idx) => {
                    return (
                        <div key={categoryID[idx]}>
                            <h2>{categoryName[idx]}</h2>
                            <h3>{categoryBudgetPercentage[idx]}</h3>
                            <hr></hr>
                        </div>
                    )
                })
            }
            
        </div>
        
    );
  }


  return (
    <>
        <h1>BUDGET</h1>
        {BudgetComponents()}
        
        <hr></hr>

        <h1>CATEGORY</h1>
        {CategoryComponents()}

    </>
  )
}
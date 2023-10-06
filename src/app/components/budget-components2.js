import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function Budget() {

  const [budgetAmount, setBudgetAmount] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetName, setBudgetName] = useState("");
  const [categoryBudgetPercentage, setCategoryBudgetPercentage] = useState(0);

  function test2() {
    console.log("fthawythuyf");
  }

  const test = async () => {
    console.log("fthawythuyf");
  }

  const postData = async () => {
    console.log("awfiytlhafwt");
    const dataToSend = {
      // budgetAmount: budgetAmount,
      // startDate: startDate,
      // endDate: endDate,
      // budgetName: budgetName,
      // categoryName: categoryName,
      // categoryBudgetPercentage: categoryBudgetPercentage,
      budgetAmount: 10,
      startDate: 10,
      endDate: 10,
      budgetName: 10,
      categoryName: 10,
      categoryBudgetPercentage: 10,
    };

    console.log(`Sending the following data to ${route}:`, dataToSend);
    const res = await fetch(`/api/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    const data = await res.json();
    console.log('Response (from client):', dataToSend);
  }


  return (
    <>
      <TextField
        label="Budget Amount"
        variant="outlined"
        value={budgetAmount}
        onChange={(event) => {
          setBudgetAmount(event.target.value);
        }}
      />
      <TextField
        label="Category Name"
        variant="outlined"
        value={categoryName}
        onChange={(event) => {
          setCategoryName(event.target.value);
        }}
      />
      <TextField
        label="Start Date"
        variant="outlined"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        value={startDate}
        onChange={(event) => {
          setStartDate(event.target.value);
        }}
      />
      <TextField
        label="End Date"
        variant="outlined"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        value={endDate}
        onChange={(event) => {
          setEndDate(event.target.value);
        }}
      />
      <TextField
        label="Budget Name"
        variant="outlined"
        value={budgetName}
        onChange={(event) => {
          setBudgetName(event.target.value);
        }}
      />
      <TextField
        label="Category Budget Percentage"
        variant="outlined"
        value={categoryBudgetPercentage}
        onChange={(event) => {
          setCategoryBudgetPercentage(event.target.value);
        }}
      />

      {budgetAmount}
      <Button variant="contained" onClick={postData}>Submit to Budget</Button>
      <Button variant="contained" onClick={test2()}>Submit to Category</Button>
    </>
  );
}

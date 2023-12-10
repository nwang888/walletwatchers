import React, { useState } from 'react';

const BudgetForm = () => {
  const [budgetName, setBudgetName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const handleSetBudget = async () => {
    if (!budgetName.trim()) {
      alert('Please enter a valid budget name.');
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || start > end) {
      alert('Please enter valid start and end dates.');
      return;
    }
    
    if (!budgetAmount || isNaN(budgetAmount) || budgetAmount <= 0) {
      alert('Please enter a valid budget amount.');
      return;
    }
    
    const budget_id = Math.floor(Math.random() * 1000000); 
    const budget = { budget_id, budget_name: budgetName, start_date: startDate, end_date: endDate, budget_amount: budgetAmount };

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budget),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();


    setBudgetName('');
    setStartDate('');
    setEndDate('');
    setBudgetAmount('');

    } catch (error) {
      console.error("Failed to post budget:", error);
      alert("Failed to set budget.");
    }
  };

  return (
    <div className='flex-col my-3'>
      <h1 className='text-2xl font-bold my-3'>Set Budget</h1>
      <div className='my-2'>
        <label className="my-2" htmlFor="budgetName">Budget Name:</label>
        <input 
          id="budgetName"
          className="mb-2 p-2 border rounded w-full" 
          type="text" 
          value={budgetName} 
          onChange={e => setBudgetName(e.target.value)} 
          placeholder="Budget Name" 
        />
      </div>
      <div className='my-2'>
        <label className="my-2" htmlFor="startDate">Start Date:</label>
        <input 
          id="startDate"
          className="mb-2 p-2 border rounded w-full" 
          type="date" 
          value={startDate} 
          onChange={e => setStartDate(e.target.value)} 
        />
      </div>
      <div className='my-2'>
        <label className="my-2" htmlFor="endDate">End Date:</label>
        <input 
          id="endDate"
          className="mb-2 p-2 border rounded w-full" 
          type="date" 
          value={endDate} 
          onChange={e => setEndDate(e.target.value)} 
        />
      </div>
      <div className='my-2'>
        <label className="my-2" htmlFor="budgetAmount">Budget Amount:</label>
        <input 
          id="budgetAmount"
          className="mb-2 p-2 border rounded w-full" 
          type="number" 
          value={budgetAmount} 
          onChange={e => setBudgetAmount(e.target.value)} 
          placeholder="Budget Amount" 
        />
      </div>
      <button 
        onClick={handleSetBudget}
        className='border-2 border-gray-200 rounded-md p-2 hover:border-gray-300 transition-colors'
      >Set Budget</button>
    </div>
  );
};

export default BudgetForm;
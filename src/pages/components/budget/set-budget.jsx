import React, { useState } from 'react';

const BudgetForm = () => {
  const [budgetName, setBudgetName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const handleSetBudget = async () => {
    const budget_id = Math.floor(Math.random() * 1000000); // Random ID for the budget
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
      // Update UI as needed
    } catch (error) {
      console.error("Failed to post budget:", error);
      alert("Failed to set budget.");
    }
  };

  return (
    <div className="flex justify-center my-5">
      <div className="w-1/2 p-3 bg-slate-50 rounded-md">
        <h1 className="text-xl mb-4">Set Budget</h1>
        <div className="flex flex-col">
          <input className="mb-2 p-2 border rounded" type="text" value={budgetName} onChange={e => setBudgetName(e.target.value)} placeholder="Budget Name" />
          <input className="mb-2 p-2 border rounded" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="Start Date" />
          <input className="mb-2 p-2 border rounded" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date" />
          <input className="mb-2 p-2 border rounded" type="number" value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)} placeholder="Budget Amount" />
          <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors" onClick={handleSetBudget}>Set Budget</button>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;

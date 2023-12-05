import React, { useState } from 'react';
import { Table, Button, TextField } from '@radix-ui/themes';

export default function SetBudgets() {
    const [budgetName, setBudgetName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');

    const postBudgetData = async () => {
        const budgetData = {
          budget_id: Math.floor(Math.random() * 1000000), // Random ID for the budget
          budget_name: budgetName,
          start_date: startDate,
          end_date: endDate,
          budget_amount: parseFloat(budgetAmount),
        };

        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(budgetData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            alert(result.message); // Alert the success message
            // Optionally reset form or update UI here
            setBudgetName('');
            setStartDate('');
            setEndDate('');
            setBudgetAmount('');
        } catch (error) {
            console.error('Failed to post budget:', error);
        }
    };

    return (
        <div>
            <TextField value={budgetName} onChange={e => setBudgetName(e.target.value)} placeholder="Budget Name" />
            <TextField type="date" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="Start Date" />
            <TextField type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date" />
            <TextField type="number" value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)} placeholder="Budget Amount" />
            <Button onClick={postBudgetData}>Add Budget</Button>
        </div>
    );
}

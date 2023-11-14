import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

import RecurringTransactions from './budget/recurring-transactions';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const [budgetName, setBudgetName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const getBudgets = async () => {
      try {
        const response = await fetch('/api/budgets');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const payload = await response.json();
        setBudgets(payload);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getBudgets();
  }, []);

  useLayoutEffect(() => {
    if (isLoading || chartInstance || !Array.isArray(budgets)) return;

    const budgetLabels = budgets.map(budget => budget.budget_name);
    const budgetAmounts = budgets.map(budget => budget.budget_amount);

    const data = {
      labels: budgetLabels,
      datasets: [{
        label: 'Budget Distribution',
        data: budgetAmounts,
        backgroundColor: [
          '#CCDFF1',
          '#EDDEF3',
          '#E8F5E4',
          '#C4E6DE',
          '#CFEAF2',
        ],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
 position: 'top',
 },
          title: {
            display: true,
            text: 'Budget Distribution'
          }
        }
      },
    };

    const newChartInstance = new Chart(chartRef.current, config);
    setChartInstance(newChartInstance);

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [isLoading, budgets]);
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
      alert(result.message); // Alert the success message
      // Optionally reset form or update UI here
      setBudgetName('');
      setStartDate('');
      setEndDate('');
      setBudgetAmount('');
    } catch (error) {
      console.error("Failed to post budget:", error);
      alert("Failed to set budget.");
    }
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Budget</h1>
      <div className="w-full p-3 bg-slate-50 rounded-md">
        {Array.isArray(budgets) && budgets.length > 0 ? (
          <canvas ref={chartRef} id="budgetChart" />
        ) : (
          <div>No budget data to display</div>
        )}
      </div>
      <div className="flex justify-center my-5">
        <div className="w-1/2 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl mb-4">Set Budget</h1>
          <div className="flex flex-col">
            <input
              className="mb-2 p-2 border rounded"
              type="text"
              value={budgetName}
              onChange={e => setBudgetName(e.target.value)}
              placeholder="Budget Name"
            />
            <input
              className="mb-2 p-2 border rounded"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              className="mb-2 p-2 border rounded"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              placeholder="End Date"
            />
            <input
              className="mb-2 p-2 border rounded"
              type="number"
              value={budgetAmount}
              onChange={e => setBudgetAmount(e.target.value)}
              placeholder="Budget Amount"
            />
            <button
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={handleSetBudget}
            >
              Set Budget
            </button>
          </div>
        </div>
      </div>


      <RecurringTransactions />
    </>
  );
}

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

import RecurringTransactions from './budget/recurring-transactions';
import BudgetForm from './budget/set-budget';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecurringLoading, setIsRecurringLoading] = useState(true);
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [budgetName, setBudgetName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  // Fetch budgets
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

  // Fetch recurring transactions
  useEffect(() => {
    const getRecurringTransactions = async () => {
      try {
        const response = await fetch('/api/recurring-transactions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const payload = await response.json();
        setRecurringTransactions(payload);
      } catch (error) {
        console.error("Failed to fetch recurring transactions:", error);
      } finally {
        setIsRecurringLoading(false);
      }
    };
    getRecurringTransactions();
  }, []);

  // Create chart
  useLayoutEffect(() => {
    if (isLoading || isRecurringLoading || chartInstance || !Array.isArray(budgets) || !Array.isArray(recurringTransactions)) return;

    const budgetLabels = budgets.map(budget => budget.budget_name);
    const budgetAmounts = budgets.map(budget => budget.budget_amount);
    const recurringAmounts = recurringTransactions.map(transaction => transaction.transaction_amount);
    const combinedAmounts = budgetAmounts.concat(recurringAmounts);
    const combinedLabels = budgetLabels.concat(recurringTransactions.map(transaction => transaction.merchant_name));

    const data = {
      labels: combinedLabels,
      datasets: [{
        label: 'Budget and Recurring Transactions',
        data: combinedAmounts,
        backgroundColor: ['#CCDFF1', '#EDDEF3', '#E8F5E4', '#C4E6DE', '#CFEAF2'],
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
            text: 'Budget and Recurring Transactions'
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
  }, [isLoading, isRecurringLoading, budgets, recurringTransactions, chartInstance]);

  if (isLoading || isRecurringLoading) {
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
      <BudgetForm />
      <RecurringTransactions />
    </>
  );
}

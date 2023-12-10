import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Wallets from './homepage/wallets';
import Chart from 'chart.js/auto';
import TransactionsTable from "./transactions-table";

export default function HomePage({ setPageNum, setWalletId }) {
  const [accountData, setAccountData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [isRecurringLoading, setIsRecurringLoading] = useState(true);
  const [recurringTransactions, setRecurringTransactions] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountResponse = await fetch('/api/account');
        const accountPayload = await accountResponse.json();
        setAccountData(accountPayload);

        const budgetResponse = await fetch('/api/budgets');
        const budgetPayload = await budgetResponse.json();
        setBudgetData(budgetPayload);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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


  useLayoutEffect(() => {
    // Budget Chart
    if (!isLoading && !isRecurringLoading && Array.isArray(budgetData) && Array.isArray(recurringTransactions) && !chartInstance) {
      const budgetLabels = budgetData.map(budgetData => budgetData.budget_name);
      const budgetAmounts = budgetData.map(budgetData => budgetData.budget_amount);
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
        type: 'pie',
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
    }
  }, [isLoading, isRecurringLoading, budgetData, recurringTransactions]);
  
  if (isLoading || isRecurringLoading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <div className="flex my-5">
        <div className="w-2/3 mr-5 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl font-semibold">Wallets</h1>
          <Wallets accountData={accountData} setPageNum={setPageNum} setWalletId={setWalletId} />
        </div>
        <div className="w-1/3 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl font-semibold">Budget</h1>
          {Array.isArray(budgetData) && budgetData.length > 0 ? (
            <canvas ref={chartRef} id="budgetChart" />
          ) : (
            <div>No budget data to display</div>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="w-2/3 mr-5 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl font-semibold">Transactions</h1>
          <TransactionsTable />
        </div>
        <div className="w-1/3 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl font-semibold">Category Spending</h1>
          <div>Placeholder</div>
        </div>
      </div>
    </>
  );
}

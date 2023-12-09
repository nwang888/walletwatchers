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

  useLayoutEffect(() => {
    if (isLoading || chartInstance || !Array.isArray(budgetData)) return;

    const data = {
      labels: budgetData.map(budget => budget.budget_name),
      datasets: [{
        label: 'Budget Distribution',
        data: budgetData.map(budget => budget.budget_amount),
        backgroundColor: [
          '#CCDFF1', '#EDDEF3', '#E8F5E4', '#C4E6DE', '#CFEAF2', '#F5E6E8',
        ],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'doughnut',
      data,
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
  }, [isLoading, budgetData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex my-5">
        <div className="w-2/3 mr-5 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Wallets</h1>
          <Wallets accountData={accountData} setPageNum={setPageNum} setWalletId={setWalletId} />
        </div>
        <div className="w-1/3 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Budget</h1>
          {Array.isArray(budgetData) && budgetData.length > 0 ? (
            <canvas ref={chartRef} id="budgetChart" />
          ) : (
            <div>No budget data to display</div>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="w-2/3 mr-5 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Transactions</h1>
          <TransactionsTable />
        </div>
        <div className="w-1/3 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Category Spending</h1>
          <div>Placeholder</div>
        </div>
      </div>
    </>
  );
}

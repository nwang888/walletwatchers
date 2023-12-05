import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Wallets from './homepage/wallets';
import Chart from 'chart.js/auto';
import TransactionsTable from "./transactions-table";

export default function HomePage({ setPageNum, setWalletId }) {
  const [accountData, setAccountData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [categorySums, setCategorySums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const barChartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [barChartInstance, setBarChartInstance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountResponse = await fetch('/api/account');
        const accountPayload = await accountResponse.json();
        setAccountData(accountPayload);

        const budgetResponse = await fetch('/api/budgets');
        const budgetPayload = await budgetResponse.json();
        setBudgetData(budgetPayload);

        const categoryResponse = await fetch('/api/sum'); 
        const categoryPayload = await categoryResponse.json();
        setCategorySums(categoryPayload);
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

  useLayoutEffect(() => {
    if (isLoading || !categorySums.length) return;
  
    const positiveCategorySums = categorySums.filter(item => item.total_amount >= 0);
  
    const barColors = positiveCategorySums.map((item, index) => {
        const colors = ['#CCDFF1', '#EDDEF3', '#E8F5E4', '#C4E6DE', '#CFEAF2', '#F5E6E8'];
        return colors[index % colors.length];
    });
  
    const barData = {
        labels: positiveCategorySums.map(item => item.category_primary),
        datasets: [{
            label: 'Total Spent per Category',
            data: positiveCategorySums.map(item => item.total_amount),
            backgroundColor: barColors,
            borderColor: barColors, 
            borderWidth: 1
        }]
    };

    const barConfig = {
        type: 'bar',
        data: barData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Set to false or true based on your preference
                },
                title: {
                    display: true,
                    text: 'Category Spending'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#444',
                    }
                },
                x: {
                    ticks: {
                        color: '#444', // Match the color to your style
                    }
                }
            }
        }
    };
  
    const newBarChartInstance = new Chart(barChartRef.current, barConfig);
    setBarChartInstance(newBarChartInstance);
  
    return () => {
        if (barChartInstance) {
            barChartInstance.destroy();
        }
    };
  }, [isLoading, categorySums]);


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
          {categorySums.length > 0 ? (
              <canvas ref={barChartRef} id="categorySpendingChart" />
          ) : (
              <div>No category spending data to display</div>
          )}
        </div>
      </div>
    </>
  );
}

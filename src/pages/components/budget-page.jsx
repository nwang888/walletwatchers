import { useEffect, useLayoutEffect, useRef, useState } from 'react'; // Import useLayoutEffect
import Chart from 'chart.js/auto';
import BudgetForm from './budget/set-budget';
import RecurringTransactions from './budget/recurring-transactions';

export default function BudgetPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRecurringLoading, setIsRecurringLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [categorySums, setCategorySums] = useState([]); // Define categorySums state
  const chartRef = useRef(null);
  const barChartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [barChartInstance, setBarChartInstance] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [reloadData, setReloadData] = useState(false);


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
                    display: true // Set to false or true based on your preference
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
  }, [reloadData]);

  // Fetch category sums
useEffect(() => {
  const getCategorySums = async () => {
    try {
      const response = await fetch('/api/sum');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const payload = await response.json();
      setCategorySums(payload);
    } catch (error) {
      console.error("Failed to fetch category sums:", error);
    } finally {
      setIsLoading(false);
    }
  };
  getCategorySums();
}, [reloadData]);

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
  }, [reloadData]);

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
        {categorySums.length > 0 ? (
          <canvas ref={barChartRef} id="categorySpendingChart" />
        ) : (
          <div>No category spending data to display</div>
        )}
      </div>
      <BudgetForm setReloadData={setReloadData} />
      <RecurringTransactions setReloadData={setReloadData} />
    </>
  );
}
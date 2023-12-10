import { useEffect, useLayoutEffect, useRef, useState } from 'react'; // Import useLayoutEffect
import Chart from 'chart.js/auto';
import BudgetForm from './budget/set-budget';
import RecurringTransactions from './budget/recurring-transactions';

export default function BudgetPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [categorySums, setCategorySums] = useState([]); 
  const chartRef = useRef(null);
  const barChartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [barChartInstance, setBarChartInstance] = useState(null);


  
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
}, []);

  useLayoutEffect(() => {
    // Category Spending Chart

    if (!isLoading && categorySums.length > 0 && !barChartInstance) {
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
              display: true
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
                color: '#444',
              }
            }
          }
        }
      };

      const newBarChartInstance = new Chart(barChartRef.current, barConfig);
      setBarChartInstance(newBarChartInstance);
    }

  }, [isLoading, categorySums, budgets]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Budget</h1>
      <div className="w-full p-3 bg-slate-50 rounded-md">
        <div>
          {categorySums.length > 0 ? (
            <canvas ref={barChartRef} id="categorySpendingChart" />
          ) : (
            <div>No category spending data to display</div>
          )}
        </div>
      </div>
      <BudgetForm />
      <RecurringTransactions />
    </>
  );
}
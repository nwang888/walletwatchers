import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
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
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      }
    };

    getBudgets();
  }, []);

  useLayoutEffect(() => {
    if (isLoading || chartInstance) return;
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

    // Instantiate new Chart
    const newChartInstance = new Chart(chartRef.current, config);
    setChartInstance(newChartInstance);

    // Cleanup
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [isLoading, budgets]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Budget</h1>
      <div className="w-full p-3 bg-slate-50 rounded-md">
        <canvas ref={chartRef} id="budgetChart" />
      </div>
      {}
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import Wallets from './homepage/wallets';
import Chart from 'chart.js/auto';

export default function HomePage({ setPageNum, setWalletId }) {
  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/api/account');
      const payload = await response.json();
      setAccountData(payload);
      setIsLoading(false);
    }

    getData();
  }, []);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const data = {
      labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
      datasets: [{
        label: 'Dataset 1',
        data: [10, 20, 30, 40, 50], // Replace this with actual data
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ],
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
  }, []);

  if (isLoading) {
    return <div>Fetching Data from DB...</div>;
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
          {/* Move the canvas element here */}
          <canvas ref={chartRef} id="budgetChart" />
        </div>
      </div>

      <div className="flex">
        <div className="w-2/3 mr-5 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Transactions</h1>
          <p>insert transactions here</p>
        </div>
        <div className="w-1/3 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Placeholder</h1>
          <p>insert something here</p>
        </div>
      </div>
    </>
  )
}

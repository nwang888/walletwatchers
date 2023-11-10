import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Wallets from './homepage/wallets';
import Chart from 'chart.js/auto';
import TransactionsTable from "./transactions-table";

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

  useLayoutEffect(() => {
    if (isLoading || chartInstance) return;

    const data = {
      labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
      datasets: [{
        label: 'Dataset 1',
        data: [10, 20, 30, 40, 50], // Replace this with actual data
        backgroundColor: [
          '#CCDFF1',
          '#EDDEF3',
          '#E8F5E4',
          '#C4E6DE',
          '#CFEAF2'
        ],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'doughnut',
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
  }, [isLoading]);

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
          <canvas ref={chartRef} id="budgetChart" />
        </div>
      </div>

      <div className="flex">
        <div className="w-2/3 mr-5 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Transactions</h1>
          <>TransactionsTable</>
        </div>
        <div className="w-1/3 p-3 bg-slate-50 rounded-md">
          <h1 className="text-xl">Placeholder</h1>
          <p>insert something here</p>
        </div>
      </div>
    </>
  );
}

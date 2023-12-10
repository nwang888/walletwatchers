import { useEffect, useRef, useState } from "react";
import { Bar } from 'react-chartjs-2';

export default function Histogram() {

    const monthPeriod = 6;

    const [timeShift, setTimeShift] = useState(0);
    const [payload, setPayload] = useState([]);
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Spending (last 12 months)',
                data: [],
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1
            }
        ]
    });

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    function updateGraph() {
        var data = {
            labels: [],
            datasets: [
                {
                    label: 'Spending (last 12 months)',
                    data: [],
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1
                }
            ]
        }

        payload.slice(timeShift, timeShift + monthPeriod).map((month, index) => {
                
                const monthName = getMonthNameFromYearMonth(month.month);
                const monthAmount = month.spending;
    
                data.labels.push(monthName);
                data.datasets[0].data.push(monthAmount);
        })

        data.labels.reverse()
        data.datasets[0].data.reverse()

        setData(data);
    
    }

    useEffect(() => {
        fetch("http://localhost:3000/api/histogram")
            .then((response) => response.json())
            .then((payload) => setPayload(payload));
    }, []);

    useEffect(() => {
        updateGraph();
    }, [payload, timeShift])


    function getMonthNameFromYearMonth(yearMonth) {
        if (!yearMonth) return 'undated';
        const [year, month] = yearMonth.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'short' }) + " '" + year.slice(2);
    }

    return (
        <div>
            <p className="text-xl font-bold">Histogram</p>

            <Bar className='m-3' data={data} options={options} />

            <div className="flex justify-center space-x-4">
                {
                    payload.slice(timeShift + 1, timeShift + monthPeriod).length > 0 ?
                    <button onClick={() => setTimeShift(timeShift + monthPeriod)} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded">
                        Previous {monthPeriod} months
                    </button>
                    :
                    <></>
                }
                {
                    timeShift > 0 ?
                    <button onClick={() => setTimeShift(timeShift - monthPeriod)} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded">
                        Next {monthPeriod} months
                    </button>
                    :
                    <></>
                }
            </div>
        </div>
    );
}
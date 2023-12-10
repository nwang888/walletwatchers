import { useEffect, useRef, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

export default function BudgetCategoryChart() {

    const monthPeriod = 6;

    const [timeShift, setTimeShift] = useState(0);
    const [payload, setPayload] = useState([]);
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Spending Per Category',
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

        payload.slice(timeShift, timeShift + monthPeriod).map((category, index) => {
                
                const monthName = category.category;
                const monthAmount = category.spending;
    
                data.labels.push(category.category);
                data.datasets[0].data.push(category.spending);
        })

        data.labels.reverse()
        data.datasets[0].data.reverse()

        setData(data);
    
    }

    useEffect(() => {
        fetch("http://localhost:3000/api/budget-category")
            .then((response) => response.json())
            .then((payload) => setPayload(payload));
    }, []);

    useEffect(() => {
        updateGraph();
    }, [payload, timeShift])




    return (
        <div>
            <p className="text-xl font-bold">Spending Categories</p>

            <Bar className='m-3' data={data} options={options} />

            <div className="flex justify-center space-x-4">
                {
                    payload.slice(timeShift + 1, timeShift + monthPeriod).length > 0 ?
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTimeShift(timeShift + monthPeriod)} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded">
                        Previous 6 Categories
                    </motion.button>
                    :
                    <></>
                }
                {
                    timeShift > 0 ?
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTimeShift(timeShift - monthPeriod)} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded">
                        Next 6 Categories
                    </motion.button>
                    :
                    <></>
                }
            </div>
        </div>
    );
}
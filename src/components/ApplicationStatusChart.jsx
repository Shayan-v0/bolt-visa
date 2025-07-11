import React from 'react';
import { Bar } from 'react-chartjs-2';
import { BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ApplicationStatusChart = ({ approved, rejected, pending }) => {
  const data = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        label: 'Applications',
        data: [approved, rejected, pending],
        backgroundColor: ['#10b981', '#ef4444', '#facc15'], // green, red, yellow
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#fff', // light purple
        },
        grid: {
          color: 'rgba(192, 132, 252, 0.1)', // light grid
        },
      },
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(192, 132, 252, 0.1)',
        },
      },
    },
  };

  return (
    <div className="visa-card p-5 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
      <BarChart3 className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 h-8 w-8 text-green-400 text-white " /> <span className="ml-2 text-white">Application Status Overview</span>
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ApplicationStatusChart;
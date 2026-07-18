"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RevenueVsExpensesChartProps {
  growthData: { year: number; revenue: number; expenses: number }[];
  theme: any;
}

const RevenueVsExpensesChart = ({ growthData, theme }: RevenueVsExpensesChartProps) => {
  const data = {
    labels: growthData.map((data) => data.year),
    datasets: [
      {
        label: "Revenue",
        data: growthData.map((data) => data.revenue),
        backgroundColor: theme.backgroundColor[0],
        borderColor: theme.borderColor,
        borderWidth: theme.borderWidth,
      },
      {
        label: "Expenses",
        data: growthData.map((data) => data.expenses),
        backgroundColor: theme.backgroundColor[1],
        borderColor: theme.borderColor,
        borderWidth: theme.borderWidth,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: theme.font,
          boxWidth: 20,
          padding: 10,
        },
      },
      title: {
        display: true,
        text: "Revenue vs Expenses",
        font: { ...theme.font, size: 16 },
        padding: 10,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ₹${value.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "INR", font: theme.font },
        ticks: {
          font: theme.font,
          callback: (value: number) => `₹${value.toLocaleString('en-IN')}`,
        },
      },
      x: {
        title: { display: true, text: "Year", font: theme.font },
        ticks: { font: theme.font },
      },
    },
    layout: {
      padding: 10,
    },
  };

  return (
    <div style={{ height: "250px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueVsExpensesChart;
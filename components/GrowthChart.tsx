"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GrowthChartProps {
  growthData: { year: number; revenue: number }[];
  theme: any;
}

const GrowthChart = ({ growthData, theme }: GrowthChartProps) => {
  const data = {
    labels: growthData.map((data) => data.year),
    datasets: [
      {
        label: "Revenue",
        data: growthData.map((data) => data.revenue),
        borderColor: theme.backgroundColor[0],
        backgroundColor: theme.backgroundColor[0].replace('0.8', '0.2'),
        borderWidth: 2,
        fill: true,
        tension: 0.4,
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
        text: "Revenue Growth",
        font: { ...theme.font, size: 16 },
        padding: 10,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `Revenue: ₹${value.toLocaleString('en-IN')}`;
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
      <Line data={data} options={options} />
    </div>
  );
};

export default GrowthChart;
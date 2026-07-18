"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface RevenueByProductChartProps {
  revenueByProduct: { productName: string; revenue: number }[];
  theme: any;
}

const RevenueByProductChart = ({ revenueByProduct, theme }: RevenueByProductChartProps) => {
  const data = {
    labels: revenueByProduct.map((item) => item.productName),
    datasets: [
      {
        label: "Revenue (INR)",
        data: revenueByProduct.map((item) => item.revenue),
        backgroundColor: theme.backgroundColor,
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
        position: "right" as const,
        labels: {
          font: theme.font,
          boxWidth: 20,
          padding: 10,
        },
      },
      title: {
        display: true,
        text: "Revenue by Product",
        font: { ...theme.font, size: 16 },
        padding: 10,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            return `${context.label}: ₹${value.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    layout: {
      padding: 10,
    },
  };

  return (
    <div style={{ height: "250px" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default RevenueByProductChart;
"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FundingSourcesChartProps {
  fundingSources: { source: string; amount: number }[];
  theme: any;
}

const FundingSourcesChart = ({ fundingSources, theme }: FundingSourcesChartProps) => {
  const data = {
    labels: fundingSources.map((item) => item.source),
    datasets: [
      {
        label: "Funding (INR)",
        data: fundingSources.map((item) => item.amount),
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
        text: "Funding Sources",
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

export default FundingSourcesChart;
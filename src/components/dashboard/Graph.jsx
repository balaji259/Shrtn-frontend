import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  Legend,
  Filler
);

const Graph = ({ graphData }) => {
  const labels = graphData?.map((item) => `${item.clickDate}`);
  const userPerDaya = graphData?.map((item) => item.count);

  const data = {
    labels:
      graphData && graphData.length > 0
        ? labels
        : ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Clicks",
        data:
          graphData && graphData.length > 0
            ? userPerDaya
            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(79, 70, 229, 0.85)", // Indigo 600
        hoverBackgroundColor: "rgba(79, 70, 229, 1)",
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 16,
        maxBarThickness: 24,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false, // Cleaner without legend
      },
      tooltip: {
        backgroundColor: "#0f172a", // Slate 900
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          family: "Inter, sans-serif",
          size: 13,
          weight: "bold",
        },
        bodyFont: {
          family: "Inter, sans-serif",
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: "rgba(226, 232, 240, 0.6)", // Faint Slate 200
        },
        ticks: {
          color: "#64748b", // Slate 500
          font: {
            family: "Inter, sans-serif",
            size: 11,
          },
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value.toString();
            }
            return "";
          },
        },
      },
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b", // Slate 500
          font: {
            family: "Inter, sans-serif",
            size: 11,
          },
        },
      },
    },
  };

  return <Bar className="w-full h-full" data={data} options={options}></Bar>;
};

export default Graph;
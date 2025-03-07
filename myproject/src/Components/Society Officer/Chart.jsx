import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Revenue",
        backgroundColor: "#0B6E4F",
        data: [80000, 60000, 50000, 90000, 10000, 70000, 80000, 30000, 100000, 95000],
      },
      {
        label: "Cost",
        backgroundColor: "#7BAFD4",
        data: [70000, 50000, 45000, 85000, 5000, 60000, 75000, 20000, 100000, 20000],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Revenue vs Cost</h3>
      <Bar data={data} />
    </div>
  );
};

export default ChartComponent;
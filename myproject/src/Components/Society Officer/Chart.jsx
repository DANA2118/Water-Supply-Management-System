import React, {useState, useEffect} from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { color } from "@mui/system";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  const [chartData, setChartData] = useState ({labels:[], datasets: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() =>{
    const fetchChartData = async () => {
      try{
        const token = localStorage.getItem('token');
        const currentYear = new Date().getFullYear();

        const response = await axios.get(`http://localhost:8082/api/revenue/monthlyrevenue?year=${currentYear}`, 
          {
            headers: {
              "Authorization" : `Bearer ${token}`,
              "Content-Type" : "application/json"
            }
          }
         );
        const costresponse = await axios.get(`http://localhost:8082/api/costreport/monthlycost?year=${currentYear}`,
          {
            headers: {
              "Authorization" : `Bearer ${token}`,
              "Content-Type" : "application/json"
            }
          }
          );

         const monthlyRevenue = response.data;
         const monthlyCost = costresponse.data;
         const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
         const revennueData = monthlyRevenue.map(item=> item.revenue);
         const costData = monthlyCost.map(item=> item.cost);
         
         setChartData({
          labels: labels,
          datasets: [
            {
              label: "Revenue",
              backgroundColor: "#0B6E4F",
              data: revennueData
            },
            {
              label: "Cost",
              backgroundColor: "#7BAFD4",
              data: costData
            }
          ],
         });
          setLoading(false);
      }catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Failed to load chart data");
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  if(loading) {return <div>Loading...</div>}
  if(error) {return <div>{error}</div>}

  return (
    <div className="chart-container">
      <Bar data={chartData} />
    </div>
  );
};
export default ChartComponent;
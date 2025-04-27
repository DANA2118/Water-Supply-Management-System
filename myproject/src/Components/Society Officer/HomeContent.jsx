import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { BiCollection, BiTrendingUp} from 'react-icons/bi';
import ChartComponent from "./Chart";
import "./HomeContent.css";
import Header from "./Header";
import axios from "axios";

const HomeContent = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [complaints, setComplaints] = useState([
    // example static data—you’d fetch this from your API
    { id: 1, date: "2025-04-16", text: "Leaky meter reported" },
    { id: 2, date: "2025-04-15", text: "Wrong billing amount" },
    { id: 3, date: "2025-04-14", text: "No water supply" },
  ]);

  useEffect(() => {
    const fetchTotalCustomers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be authenticated.");
        return;
      }
    
      try {
        const response = await axios.get("http://localhost:8082/api/customer/total", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
    
        console.log("API Response:", response); // 🔍 Debugging
        console.log("Response Data:", response.data); // 🔍 Debugging
    
        setTotalCustomers(response.data || 0); 
      } catch (error) {
        console.error("Error fetching total customers:", error);
      }
    };    
    fetchTotalCustomers();
  }, []);

  useEffect(() => {
    const fetchActiveCustomers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be authenticated.");
        return;
      }
    
      try {
        const response = await axios.get("http://localhost:8082/api/customer/active", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
    
        console.log("API Response:", response); // 🔍 Debugging
        console.log("Response Data:", response.data); // 🔍 Debugging
    
        setActiveCustomers(response.data || 0); 
      } catch (error) {
        console.error("Error fetching total customers:", error);
      }
    };    
    fetchActiveCustomers();
  }, []);

  return (
    <div className="HomeContent">
      <Header />
      <Sidebar />
      <main className="main-container">
        <div className="main-cards">
          <div className="card">
            <div className="card-inner">
              <h3>Total Connections</h3>
              <BiCollection className="icon blue" />
            </div>
            <h1>{totalCustomers}</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Active Connections</h3>
              <BiCollection className="icon green" />
            </div>
            <h1>{activeCustomers}</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Pending Connections</h3>
              <BiCollection className="icon yellow" />
            </div>
            <h1>0</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Revenue Growth</h3>
              <BiTrendingUp className="icon purple" />
            </div>
            <div className="card-value">7.5%</div>
            <div className="card-footnote green">+7.5% ↑</div>
          </div>
        </div>
        <div className="chart-and-complaints">
          <div className="chart">
            <h3 className="chart-title">Revenue vs Cost</h3>
            <ChartComponent />
          </div>

          {/* NEW Complaints pane */}
          <aside className="complaints">
            <h3>Recent Complaints</h3>
            <ul>
              {complaints.map(c => (
                <li key={c.id}>
                  <strong>{c.date}</strong>: {c.text}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HomeContent;

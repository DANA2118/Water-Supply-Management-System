import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { BiCollection, BiTrendingUp, BiChevronUp, BiChevronDown} from 'react-icons/bi';
import ChartComponent from "./Chart";
import "./HomeContent.css";
import Header from "./Header";
import axios from "axios";

const HomeContent = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [complaints, setComplaints] = useState([0]);
  const [expandedComplaint, setExpandedComplaint] = useState(null);

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

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be authenticated.");
        return;
      }
    
      try {
        const response = await axios.get("http://localhost:8082/api/complaint/all", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setComplaints(response.data || []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  const toggleComplaint = (complaintId) => {
    if (expandedComplaint === complaintId) {
      setExpandedComplaint(null);
    } else {
      setExpandedComplaint(complaintId);
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

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
            <div className="card-value">0</div>
          </div>
        </div>
        <div className="chart-and-complaints">
          <div className="chart">
            <h3 className="chart-title">Revenue vs Cost</h3>
            <ChartComponent />
          </div>

          <aside className="complaints">
            <h3>Recent Complaints</h3>
            {complaints.length === 0 ? (
              <p className="no-complaints">No recent complaints</p>
            ) : (
              <ul className="complaints-list">
                {complaints.map(complaint => (
                  <li key={complaint.complaintId} className="complaint-item">
                    <div 
                      className="complaint-header" 
                      onClick={() => toggleComplaint(complaint.complaintId)}
                    >
                      <div className="complaint-summary">
                        <div className="complaint-date">{formatDate(complaint.date)}</div>
                        <div className="complaint-subject">
                          {complaint.subject || "No Subject"}
                        </div>
                        <div className="complaint-account">Account: {complaint.accountNo}</div>
                      </div>
                      {expandedComplaint === complaint.complaintId ? 
                        <BiChevronUp className="expand-icon" /> : 
                        <BiChevronDown className="expand-icon" />
                      }
                    </div>
                    {expandedComplaint === complaint.complaintId && (
                      <div className="complaint-description">
                        {complaint.description}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HomeContent;

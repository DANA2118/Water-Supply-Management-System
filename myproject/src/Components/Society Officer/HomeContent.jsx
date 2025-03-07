import React from "react";
import Sidebar from "./Sidebar";
import { BiHome, BiCollection, BiReceipt, BiCalendar, BiAbacus } from 'react-icons/bi';
import ChartComponent from "./Chart";
import "./HomeContent.css";
import Header from "./Header";

const HomeContent = () => {
  return (
    <div className="HomeContent">
      <Header />
      <Sidebar />
      <main className="main-container">
        <div className="main-title">
          <h3>Dashboard</h3>
        </div>
        <div className="main-cards">
          <div className="card">
            <div className="card-inner">
              <h3>Total Connections</h3>
              <BiCollection className="icon" />
            </div>
            <h1>01</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Active Connections</h3>
              <BiCollection className="icon" />
            </div>
            <h1>01</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Pending Connections</h3>
              <BiCollection className="icon" />
            </div>
            <h1>0</h1>
          </div>
        </div>
        <div className="charts">
          <div className="chart">
            <ChartComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeContent;

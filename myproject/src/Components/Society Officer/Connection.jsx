import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Search from "./Search";
import CustomizedTables from "./Table";
import { IoMdAdd } from "react-icons/io";
import "./Connection.css";

const Connection = () => {
  return (
    <div className="Connection">
      <Header />
      <Sidebar />
      <div className="main-container">
        <div className="main-title">
          <h3>Customer List</h3>
        </div>

        <div className="top-section">
          <div className="search-container">
            <Search />
          </div>

          {/* 🎯 Add & View Arrears Buttons aligned with table */}
          <div className="button-container">
            <button className="add-button">
              <IoMdAdd className="add-icon" />
              Add Customer
            </button>
            <button className="view-button">View Arrears</button>
          </div>
        </div>

        <div className="table-container">
          <CustomizedTables />
        </div>
      </div>
    </div>
  );
};

export default Connection;

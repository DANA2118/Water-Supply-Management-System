import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CustomizedTables from "./Table";
import "./Connection.css";

const Connection = () => {
  return (
    <div className="Connection">
      <Header />
      <Sidebar />
      <div className="table-container">
        <CustomizedTables />
      </div>
    </div>
  );
};

export default Connection;

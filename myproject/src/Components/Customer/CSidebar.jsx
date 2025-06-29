import React from 'react';
import { BiHome, BiCollection, BiReceipt, BiCalendar, BiAbacus, BiHistory, BiMoney, BiComment } from 'react-icons/bi';
import '.\Society Officer\Sidebar.css';

const CSidebar = ({ sidebarOpen }) => {
    return (
        <div className={`menu ${sidebarOpen ? "open" : "closed"}`}>
            <div className="logo">
                <h2>HydroNet</h2>
            </div>
            <div className="menu--list">
                <a href="#" className="item"><BiHome className="icon" />Dashboard</a>
                <a href="#" className="item"><BiHistory className="icon" />Usage History</a>
                <a href="#" className="item"><BiMoney className="icon" />Payments</a>
                <a href="#" className="item"><BiComment className="icon" />Complaints</a>
                <a href="#" className="item"><BiCalendar className="icon" />About Us</a>
            </div>
        </div>
    );
};

export default CSidebar;

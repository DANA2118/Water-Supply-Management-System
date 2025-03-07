import React from 'react';
import { BiHome, BiCollection, BiReceipt, BiCalendar, BiAbacus } from 'react-icons/bi';
import './Sidebar.css';

const Sidebar = ({ sidebarOpen }) => {
    return (
        //<div className={`menu ${sidebarOpen ? "open" : "closed"}`}>
        //    <div className="logo">
        //        <h2>HydroNet</h2>
        //    </div>
        //    <div className="menu--list">
        //        <a href="#" className="item"><BiHome className="icon" />Dashboard</a>
        //        <a href="#" className="item"><BiCollection className="icon" />Connections</a>
        //        <a href="#" className="item"><BiReceipt className="icon" />Bill Generate</a>
        //        <a href="#" className="item"><BiAbacus className="icon" />Reports</a>
        //        <a href="#" className="item"><BiCalendar className="icon" />Certificate Scheduling</a>
        //    </div>
        //</div>
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="/HomeContent">
                        <BiHome className="icon" />
                        <span>Dashboard</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/Connection">
                        <BiCollection className="icon" />
                        <span>Connections</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/bill">
                        <BiReceipt className="icon" />
                        <span>Bill Generate</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/reports">
                        <BiAbacus className="icon" />
                        <span>Reports</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/certificate">
                        <BiCalendar className="icon" />
                        <span>Certificate Scheduling</span>
                    </a>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;

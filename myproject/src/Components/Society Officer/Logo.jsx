import React from 'react'
import './Logo.css';


function Logo() {
    const toggleSidebar = () => {
        document.body.classList.toggle('toggle-sidebar');
    };
    
    return (
        <div className="d-flex align-items-center justify-content-between">
            <a href="/" className="logo d-flex align-items-center">
                <span className="d-none d-lg-block">HydroNet</span>
            </a>
            <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}>
            </i>
        </div>
    );
}

export default Logo;
// src/Components/Society Officer/Billing.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';
import {
    DollarSign, FileText, Printer, Mail, Search, Filter, Download
} from 'lucide-react';
import './Invoice.css';

const Billing = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummaries = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const res = await axios.get(
                    'http://localhost:8082/api/invoice/getall',
                    { headers }
                );
                console.log("Fetched invoices:", res.data);
                setInvoices(res.data);
            } catch (err) {
                console.error("Error loading invoices:", err);
                setError('Failed to load invoices');
            } finally {
                setLoading(false);
            }
        };
        fetchSummaries();
    }, []);

    if (loading) return <div className="billing-content">Loading…</div>;
    if (error) return <div className="billing-content">Error: {error}</div>;

    // Filter list by status
    const filtered = invoices.filter(inv =>
        statusFilter === 'all' || inv.status.toLowerCase() === statusFilter
    );

    // Cards metrics
    const totalRevenue = filtered.reduce((sum, inv) =>
        sum + (inv.totalamount || 0)
        , 0);
    const totalBalance = filtered.reduce((sum, inv) =>
        sum + (inv.balanceforpay || 0)
        , 0);
    const pending = filtered.filter(inv =>
        inv.status.toLowerCase() === 'unpaid'
    );
    const pendingCount = pending.length;
    const pendingDue = pending.reduce((sum, inv) =>
        sum + (inv.balanceForPay || 0)
        , 0);

    const badgeClass = status => {
        switch (status.toLowerCase()) {
            case 'paid': return 'badge badge--green';
            case 'unpaid': return 'badge badge--yellow';
            case 'overdue': return 'badge badge--red';
            default: return 'badge badge--gray';
        }
    };

    return (
        <div className="billing-page">
            <Header />
            <Sidebar />
            <main className="billing-content">
                <h1 className="page-title">Billing</h1>

                {/* ——— CARDS ——— */}
                <div className="cards">
                    <div className="card">
                        <div className="card-icon card-icon--blue"><DollarSign size={24} /></div>
                        <div>
                            <div className="card-label">Total Revenue</div>
                            <div className="card-value">{totalRevenue.toFixed(2)}</div>
                            <div className="card-note card-note--green">
                                +{((totalRevenue / 10000) * 100).toFixed(1)}% from last month
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon card-icon--green"><FileText size={24} /></div>
                        <div>
                            <div className="card-label">Total Overdue amount</div>
                            <div className="card-value">{totalBalance}</div>
                            <div className="card-note">
                                For {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon card-icon--yellow"><FileText size={24} /></div>
                        <div>
                            <div className="card-label">Pending Payments</div>
                            <div className="card-value">{pendingCount}</div>
                            <div className="card-note">{pendingDue.toFixed(2)} due</div>
                        </div>
                    </div>
                </div>

                {/* ——— CONTROLS ——— */}
                <div className="controls">
                    <div className="search-box">
                        <Search size={16} className="icon-inline" />
                        <input
                            type="text"
                            placeholder="Search bills..."
                            className="search-input"
                            onChange={e => {
                                const q = e.target.value.toLowerCase();
                                setInvoices(invoices.filter(inv =>
                                    inv.customerName.toLowerCase().includes(q)
                                ));
                            }}
                        />
                    </div>
                    <div className="filters">
                        <div className="filter-box">
                            <Filter size={16} className="icon-inline" />
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Pending</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                        <button className="btn btn--primary" onClick={() => navigate('/bill')}>
                            <FileText size={16} className="btn-icon" />
                            Generate Bills
                        </button>
                        <button className="btn btn--outline">
                            <Download size={16} className="btn-icon" />
                            Export
                        </button>
                    </div>
                </div>

                {/* ——— TABLE ——— */}
                <div className="table-container">
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Customer Name</th>
                                <th>Account No</th>
                                <th>Balance Due</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(invoice => (
                                <tr key={invoice.invoiceId}>
                                    <td className="td-bold">{invoice.invoiceId}</td>
                                    <td>{invoice.customerName}</td>
                                    <td>{invoice.accountNo}</td>
                                    <td className="td-bold">{invoice.balanceforpay.toFixed(2)}</td>
                                    <td>{invoice.duedate}</td>
                                    <td>
                                        <span className={badgeClass(invoice.status)}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="actions">
                                        <FileText size={16} className="action-icon action-icon--blue" title="View" />
                                        <Printer size={16} className="action-icon action-icon--green" title="Print" />
                                        <Mail size={16} className="action-icon action-icon--purple" title="Email" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ——— PAGINATION ——— */}
                <div className="pagination">
                    <div className="page-info">
                        Showing <strong>{filtered.length}</strong> of <strong>{invoices.length}</strong> bills
                    </div>
                    <div className="page-controls">
                        <button className="btn btn--outline btn--sm" disabled>Previous</button>
                        <span className="page-number">Page 1 of 1</span>
                        <button className="btn btn--outline btn--sm" disabled>Next</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Billing;

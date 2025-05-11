import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';
import {
    DollarSign, FileText, Users, Search, Filter, Download
} from 'lucide-react';
import './Invoice.css';

const Cost = () => {
    const [vouchers, setVouchers] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [monthlyCost, setMonthlyCost] = useState(0);
    const [yearlyCost, setYearlyCost] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;

    // Pagination calculations - use filteredVouchers, not filtered!
    const totalPages = Math.max(1, Math.ceil(filteredVouchers.length / resultsPerPage));
    const paginatedResults = filteredVouchers.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    useEffect(() => {
        const fetchVouchers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const res = await axios.get(
                    'http://localhost:8082/api/paymentvoucher/all',
                    { headers }
                );
                setVouchers(res.data);
                setFilteredVouchers(res.data);
            } catch (err) {
                setError('Failed to load vouchers');
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, []);

    useEffect(() => {
        const fetchCosts = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            try {
                const monthlyRes = await axios.get(
                    `http://localhost:8082/api/paymentvoucher/monthly?month=${month}&year=${year}`,
                    { headers }
                );
                setMonthlyCost(typeof monthlyRes.data.totalcost === 'number'
                    ? monthlyRes.data.totalcost
                    : 0
                );
            } catch (err) {
                console.warn('Failed to fetch monthly cost', err);
                setMonthlyCost(0);
            }

            try {
                const yearlyRes = await axios.get(
                    `http://localhost:8082/api/paymentvoucher/yearly?year=${year}`,
                    { headers }
                );
                setYearlyCost(typeof yearlyRes.data.totalcost === 'number'
                    ? yearlyRes.data.totalcost
                    : 0
                );
            } catch (err) {
                console.warn('Failed to fetch yearly cost', err);
                setYearlyCost(0);
            }
        };

        fetchCosts();
    }, []);

    // Reset to page 1 when search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredVouchers]);

    const handleSearch = (e) => {
        const q = e.target.value.toLowerCase();
        setSearch(q);
        setFilteredVouchers(
            vouchers.filter(v =>
                v.payee && v.payee.toLowerCase().includes(q)
            )
        );
    };

    const currentYear = new Date().getFullYear();
    const totalVouchers = filteredVouchers.length;

    if (loading) return <div className="billing-content">Loading…</div>;
    if (error) return <div className="billing-content">Error: {error}</div>;

    return (
        <div className="billing-page">
            <Header />
            <Sidebar />
            <main className="billing-content">
                <h1 className="page-title">Payment Vouchers</h1>

                {/* --- CARDS --- */}
                <div className="cards">
                    <div className="card">
                        <div className="card-icon card-icon--blue"><DollarSign size={24} /></div>
                        <div>
                            <div className="card-label">Yearly Cost</div>
                            <div className="card-value">{yearlyCost.toFixed(2)}</div>
                            <div className="card-note card-note--blue">
                                {currentYear}
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon card-icon--green"><FileText size={24} /></div>
                        <div>
                            <div className="card-label">Monthly Cost</div>
                            <div className="card-value">{monthlyCost.toFixed(2)}</div>
                            <div className="card-note card-note--green">
                                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon card-icon--yellow"><Users size={24} /></div>
                        <div>
                            <div className="card-label">Total Vouchers</div>
                            <div className="card-value">{totalVouchers}</div>
                            <div className="card-note card-note--yellow">{yearlyCost.toFixed(2)} total</div>
                        </div>
                    </div>
                </div>

                <div className="controls">
                    <div className="search-box">
                        <Search size={16} className="icon-inline" />
                        <input
                            type="text"
                            placeholder="Search by payee name..."
                            className="search-input"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="filters">
                        <button className="btn btn--primary" onClick={() => navigate('/paymentvoucher')}>
                            <FileText size={16} className="btn-icon" />
                            Add Voucher
                        </button>
                        <button className="btn btn--outline">
                            <Download size={16} className="btn-icon" />
                            Export
                        </button>
                    </div>
                </div>

                {/* --- TABLE --- */}
                <div className="table-container">
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th>Voucher ID</th>
                                <th>Payee</th>
                                <th>Voucher Date</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedResults.map(voucher => (
                                <tr key={voucher.voucherId}>
                                    <td className="td-bold">{voucher.voucherId}</td>
                                    <td>{voucher.payee}</td>
                                    <td>{voucher.voucherDate}</td>
                                    <td className="td-bold">{voucher.totalcost?.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <div className="page-info">
                        Showing <strong>{paginatedResults.length}</strong> of <strong>{filteredVouchers.length}</strong> vouchers
                    </div>
                    <div className="page-controls">
                        <button
                            className="btn btn--outline btn--sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                        <span className="page-number">Page {currentPage} of {totalPages}</span>
                        <button
                            className="btn btn--outline btn--sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            Next
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Cost;

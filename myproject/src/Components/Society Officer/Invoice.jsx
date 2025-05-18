import React, { useState, useEffect } from 'react';
import { useNavigate }                 from "react-router-dom";
import Sidebar                        from './Sidebar';
import Header                         from './Header';
import axios                          from 'axios';
import {
  DollarSign, FileText, Printer, Mail,
  Search, Filter, Download
} from 'lucide-react';
import './Invoice.css';

const Billing = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [invoices,     setInvoices]     = useState([]);
  const [isOverdue,    setIsOverdue]    = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [totalrevenue, setTotalRevenue] = useState(0);
  const [error,        setError]        = useState(null);
  const navigate = useNavigate();

  // Whenever we fetch (all or overdue), call this
  const fetchInvoices = async (mode) => {
    setLoading(true);
    setError(null);
    try {
      const token   = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const url     = mode === 'overdue'
                    ? '/api/arrears/overdue'
                    : '/api/invoice/getall';
      const res     = await axios.get(`http://localhost:8082${url}`, { headers });
      setIsOverdue(mode === 'overdue');
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
      setError(`Failed to load ${mode === 'overdue' ? 'overdue' : 'all'} invoices`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices('all');
  }, []);
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);

    if (value === 'overdue') {
      fetchInvoices('overdue');
    } else {
      fetchInvoices('all');
    }
  };

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      const token   = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const year   = new Date().getFullYear();
      try {
        const res = await axios.get(
          `http://localhost:8082/api/revenue/annualrevenue?year=${year}`,
          { headers }
        );
        setTotalRevenue(res.data.totalrevenue);
      } catch (err) {
        console.error(err);
        setError('Failed to load total revenue');
      }
    };
    fetchTotalRevenue();
  }, []);

  if (loading) return <div className="billing-content">Loading…</div>;
  if (error)   return <div className="billing-content">Error: {error}</div>;

  const normalized = invoices.map(inv => ({
    ...inv,
    customerName: inv.customerName ?? inv.name,
    status: isOverdue
      ? 'overdue'
      : inv.status || 'unknown'
  }));

  const filtered = normalized.filter(inv =>
    statusFilter === 'all'
      || inv.status.toLowerCase() === statusFilter
  );

  const totalBalance = filtered.reduce((sum, inv) =>
    sum + (inv.balanceforpay || 0), 0
  );
  const pending      = filtered.filter(inv =>
    inv.status.toLowerCase() === 'unpaid'
  );
  const pendingCount = pending.length;
  const pendingDue   = pending.reduce((sum, inv) =>
    sum + (inv.balanceforpay || 0), 0
  );

  const badgeClass = status => {
    switch (status.toLowerCase()) {
      case 'paid':    return 'badge badge--green';
      case 'unpaid':  return 'badge badge--yellow';
      case 'overdue': return 'badge badge--red';
      default:        return 'badge badge--gray';
    }
  };

  return (
    <div className="billing-page">
      <Header />
      <Sidebar />
      <main className="billing-content">
        <h1 className="page-title">Billing</h1>

        {/* — CARDS — */}
        <div className="cards">
          <div className="card">
            <div className="card-icon card-icon--blue">
              <DollarSign size={24}/>
            </div>
            <div>
              <div className="card-label">Total Revenue</div>
              <div className="card-value">
                {totalrevenue.toFixed(2)}
              </div>
              <div className="card-note card-note--green">
                +{((totalrevenue/10000)*100).toFixed(1)}% from last month
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-icon card-icon--green">
              <FileText size={24}/>
            </div>
            <div>
              <div className="card-label">
                {statusFilter === 'overdue'
                  ? 'Total Overdue Amount'
                  : 'Total Balance Due'}
              </div>
              <div className="card-value">
                {totalBalance.toFixed(2)}
              </div>
              <div className="card-note">
                For {new Date().toLocaleString('default', {
                  month: 'long', year: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-icon card-icon--yellow">
              <FileText size={24}/>
            </div>
            <div>
              <div className="card-label">Pending Payments</div>
              <div className="card-value">{pendingCount}</div>
              <div className="card-note">
                {pendingDue.toFixed(2)} due
              </div>
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="search-box">
            <Search size={16} className="icon-inline" />
            <input
              type="text"
              placeholder="Search bills..."
              className="search-input"
              onChange={e => {
                const q = e.target.value.toLowerCase();
                setInvoices(normalized.filter(inv =>
                  inv.customerName
                    .toLowerCase()
                    .includes(q)
                ));
              }}
            />
          </div>
          <div className="filters">
            <div className="filter-box">
              <Filter size={14} className="icon-inline" />
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <button
              className="btn btn--primary"
              onClick={() => navigate('/bill')}
            >
              <FileText size={16} className="btn-icon"/>
              Generate Bills
            </button>
            <button className="btn btn--primary" onClick={() => navigate('/paymentform')}>
              Payments
            </button>
          </div>
        </div>

        {/* — TABLE — */}
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
              {filtered.map(inv => (
                <tr key={inv.invoiceId}>
                  <td className="td-bold">{inv.invoiceId}</td>
                  <td>{inv.customerName}</td>
                  <td>{inv.accountNo}</td>
                  <td className="td-bold">
                    {inv.balanceforpay.toFixed(2)}
                  </td>
                  <td>{inv.duedate}</td>
                  <td>
                    <span className={badgeClass(inv.status)}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td className="actions">
                    <FileText size={16} className="action-icon action-icon--blue"  title="View"/>
                    <Printer  size={16} className="action-icon action-icon--green" title="Print"/>
                    <Mail     size={16} className="action-icon action-icon--purple"title="Email"/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* — PAGINATION — */}
        <div className="pagination">
          <div className="page-info">
            Showing <strong>{filtered.length}</strong> of <strong>{invoices.length}</strong> bills
          </div>
          <div className="page-controls">
            <button className="btn btn--outline btn--sm" disabled>
              Previous
            </button>
            <span className="page-number">Page 1 of 1</span>
            <button className="btn btn--outline btn--sm" disabled>
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;

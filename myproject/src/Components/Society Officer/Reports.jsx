import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import Header from './Header';
import Sidebar from './Sidebar';
import './Reports.css';
import ReportDocument from './ReportDocument';
import IncomeStatementDocument from './IncomeStatementDocument';
import { BiDownload, BiPrinter, BiRefresh } from 'react-icons/bi';

const Reports = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cost'); // 'cost' or 'income'
  const [reportType, setReportType] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [reportData, setReportData] = useState(null);
  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('All');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [showDescriptionDropdown, setShowDescriptionDropdown] = useState(false);
  const [commonDescriptions, setCommonDescriptions] = useState(['All', 'Electricity', 'Chlorine']);

  // Available years for dropdown (current year and 4 previous years)
  const availableYears = Array.from(
    { length: 5 }, 
    (_, i) => new Date().getFullYear() - i
  );

  // Filter descriptions based on input
  const filteredDescriptions = descriptionInput 
    ? commonDescriptions.filter(desc => 
        desc.toLowerCase().includes(descriptionInput.toLowerCase())
      )
    : commonDescriptions;

  // Fetch report data
  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      let url;
      
      if (activeTab === 'cost') {
        // Determine which endpoint to use based on report type and description
        if (description === 'All') {
          // Use the regular endpoints for 'All' description
          if (reportType === 'monthly') {
            url = `http://localhost:8082/api/paymentvoucher/report/monthly?month=${month}&year=${year}`;
          } else {
            url = `http://localhost:8082/api/paymentvoucher/report/yearly?year=${year}`;
          }
        } else {
          // Use the description-specific endpoints
          if (reportType === 'monthly') {
            url = `http://localhost:8082/api/paymentvoucher/description/monthly?month=${month}&year=${year}&description=${description}`;
          } else {
            url = `http://localhost:8082/api/paymentvoucher/description/yearly?year=${year}&description=${description}`;
          }
        }
        
        const response = await axios.get(url, { headers });
        setReportData(response.data);
      } else {
        // Income Statement
        url = `http://localhost:8082/api/revenue/profitloss?year=${year}`;
        const response = await axios.get(url, { headers });
        setIncomeData(response.data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to fetch report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF and download
  const generatePDF = async () => {
    try {
      let blob;
      let fileName;
      
      if (activeTab === 'cost') {
        blob = await pdf(
          <ReportDocument 
            data={reportData} 
            reportType={reportType} 
            description={description !== 'All' ? description : null}
          />
        ).toBlob();
        
        fileName = reportType === 'monthly' 
          ? `${description !== 'All' ? description + '_' : ''}monthly_cost_report_${reportData.period}.pdf` 
          : `${description !== 'All' ? description + '_' : ''}yearly_cost_report_${reportData.period}.pdf`;
      } else {
        blob = await pdf(
          <IncomeStatementDocument 
            data={incomeData}
          />
        ).toBlob();
        
        fileName = `income_statement_${incomeData.year}.pdf`;
      }
      
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  // Print the report
  const printReport = async () => {
    try {
      let blob;
      
      if (activeTab === 'cost') {
        blob = await pdf(
          <ReportDocument 
            data={reportData} 
            reportType={reportType}
            description={description !== 'All' ? description : null}
          />
        ).toBlob();
      } else {
        blob = await pdf(
          <IncomeStatementDocument 
            data={incomeData}
          />
        ).toBlob();
      }
      
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url);
      
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error('Error printing report:', error);
      setError('Failed to print report. Please try again.');
    }
  };

  // Format period for display
  const formatPeriod = (period) => {
    if (!period) return '';
    
    if (reportType === 'monthly') {
      const [year, month] = period.split('-');
      const monthName = new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'long' });
      return `${monthName} ${year}`;
    }
    
    return period; // For yearly reports, just return the year
  };

  return (
    <div className="reports-page">
      <Header />
      <Sidebar />
      <main className="reports-content">
        <h1 className="page-title">Financial Reports</h1>
        
        <div className="report-tabs">
          <button 
            className={`tab-button ${activeTab === 'cost' ? 'active' : ''}`}
            onClick={() => setActiveTab('cost')}
          >
            Cost Reports
          </button>
          <button 
            className={`tab-button ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            Income Statement
          </button>
        </div>
        
        <div className="report-controls">
          {activeTab === 'cost' && (
            <>
              <div className="control-group">
                <label>Report Type</label>
                <select 
                  value={reportType} 
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="monthly">Monthly Report</option>
                  <option value="yearly">Yearly Report</option>
                </select>
              </div>
              
              <div className="control-group">
                <label>Year</label>
                <select 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)}
                >
                  {availableYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              
              {reportType === 'monthly' && (
                <div className="control-group">
                  <label>Month</label>
                  <select 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>
                        {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="control-group">
                <label>Description</label>
                <div className="dropdown-container">
                  <input
                    type="text"
                    value={descriptionInput}
                    onChange={(e) => {
                      setDescriptionInput(e.target.value);
                      setShowDescriptionDropdown(true);
                    }}
                    onFocus={() => setShowDescriptionDropdown(true)}
                    placeholder="Select or type description"
                    className="description-input"
                  />
                  {showDescriptionDropdown && (
                    <div className="description-dropdown">
                      {filteredDescriptions.map(desc => (
                        <div 
                          key={desc} 
                          className="dropdown-item"
                          onClick={() => {
                            setDescription(desc);
                            setDescriptionInput(desc);
                            setShowDescriptionDropdown(false);
                          }}
                        >
                          {desc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'income' && (
            <div className="control-group">
              <label>Year</label>
              <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
          
          <button className="btn btn-primary" onClick={fetchReport}>
            <BiRefresh /> Generate Report
          </button>
        </div>
        
        {loading && <div className="loading">Loading report data...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === 'cost' && reportData && (
          <div className="report-container">
            <div className="report-header">
              <h2>
                {description !== 'All' ? `${description} Cost Report - ` : ''}
                {reportType === 'monthly' ? 'Monthly' : 'Yearly'} Cost Report - {formatPeriod(reportData.period)}
              </h2>
              <div className="report-actions">
                <button className="btn btn-secondary" onClick={generatePDF}>
                  <BiDownload /> Download PDF
                </button>
                <button className="btn btn-secondary" onClick={printReport}>
                  <BiPrinter /> Print
                </button>
              </div>
            </div>
            
            <div className="report-summary">
              <div className="summary-card">
                <div className="summary-label">Total Cost</div>
                <div className="summary-value">Rs. {reportData.totalCost.toFixed(2)}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Vouchers</div>
                <div className="summary-value">{reportData.vouchers.length}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Period</div>
                <div className="summary-value">{formatPeriod(reportData.period)}</div>
              </div>
              {description !== 'All' && (
                <div className="summary-card">
                  <div className="summary-label">Description</div>
                  <div className="summary-value">{description}</div>
                </div>
              )}
            </div>
            
            <div className="report-table-container">
              <h3>Voucher Details</h3>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Voucher ID</th>
                    <th>Payee</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.vouchers.map(voucher => (
                    <React.Fragment key={voucher.voucherId}>
                      {voucher.items.map((item, index) => (
                        <tr key={`${voucher.voucherId}-${item.id}`}>
                          {index === 0 ? (
                            <>
                              <td rowSpan={voucher.items.length}>{voucher.voucherId}</td>
                              <td rowSpan={voucher.items.length}>{voucher.payee}</td>
                              <td rowSpan={voucher.items.length}>{voucher.voucherDate}</td>
                            </>
                          ) : null}
                          <td>{item.description}</td>
                          <td className="amount">{item.cost.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="subtotal-row">
                        <td colSpan="4" className="subtotal-label">Voucher Total:</td>
                        <td className="amount">{voucher.totalcost.toFixed(2)}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td colSpan="4" className="total-label">Grand Total:</td>
                    <td className="amount">{reportData.totalCost.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'income' && incomeData && (
          <div className="report-container">
            <div className="report-header">
              <h2>Income Statement - {incomeData.year}</h2>
              <div className="report-actions">
                <button className="btn btn-secondary" onClick={generatePDF}>
                  <BiDownload /> Download PDF
                </button>
                <button className="btn btn-secondary" onClick={printReport}>
                  <BiPrinter /> Print
                </button>
              </div>
            </div>
            
            <div className="report-summary">
              <div className="summary-card">
                <div className="summary-label">Total Revenue</div>
                <div className="summary-value">Rs. {incomeData.totalRevenue.toFixed(2)}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Total Cost</div>
                <div className="summary-value">Rs. {incomeData.totalCost.toFixed(2)}</div>
              </div>
              <div className="summary-card">
                <div className={`summary-label ${incomeData.profitLoss < 0 ? 'loss' : 'profit'}`}>
                  {incomeData.profitLoss < 0 ? 'Net Loss' : 'Net Profit'}
                </div>
                <div className={`summary-value ${incomeData.profitLoss < 0 ? 'loss-value' : 'profit-value'}`}>
                  Rs. {Math.abs(incomeData.profitLoss).toFixed(2)}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Year</div>
                <div className="summary-value">{incomeData.year}</div>
              </div>
            </div>
            
            <div className="report-table-container">
              <h3>Income Statement</h3>
              <table className="report-table">
                <thead>
                  <tr>
                    <th colSpan="2">Income Statement for {incomeData.year}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="income-row">
                    <td>Revenue</td>
                    <td className="amount">Rs. {incomeData.totalRevenue.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="expense-header">Expenses</td>
                  </tr>
                  {incomeData.costBreakdown.map(item => (
                    <tr key={item.id} className="expense-row">
                      <td>{item.description}</td>
                      <td className="amount">Rs. {item.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="total-expenses-row">
                    <td>Total Expenses</td>
                    <td className="amount">Rs. {incomeData.totalCost.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className={`${incomeData.profitLoss < 0 ? 'loss-row' : 'profit-row'}`}>
                    <td>{incomeData.profitLoss < 0 ? 'Net Loss' : 'Net Profit'}</td>
                    <td className="amount">Rs. {Math.abs(incomeData.profitLoss).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;

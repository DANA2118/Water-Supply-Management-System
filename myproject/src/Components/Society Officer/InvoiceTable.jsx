import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  styled
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#101c24',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#1a2c37',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#152630',
  },
  '&:hover': {
    backgroundColor: '#203440 !important',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableContainer = styled(TableContainer)({
  maxWidth: 800,
  width: '80%',
  margin: '20px auto',
  marginLeft: '450px',
  background: 'rgba(16, 28, 36, 0.8)',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '& .MuiTable-root': {
    minWidth: 650,
  },
  '& .MuiTableCell-head': {
    color: '#ffffff',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  },
  '& .MuiTableCell-body': {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
});

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8082/api/invoice/all", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <StyledTableContainer component={Paper}>
      <Table aria-label="invoice table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Invoice ID</StyledTableCell>
            <StyledTableCell>Customer Name</StyledTableCell>
            <StyledTableCell>Account No</StyledTableCell>
            <StyledTableCell>Balance For Pay</StyledTableCell>
            <StyledTableCell>Due Date</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <StyledTableRow key={invoice.invoiceId}>
              <StyledTableCell>{invoice.invoiceId}</StyledTableCell>
              <StyledTableCell>{invoice.customerName}</StyledTableCell>
              <StyledTableCell>{invoice.accountNo}</StyledTableCell>
              <StyledTableCell>Rs. {invoice.balanceForPay.toFixed(2)}</StyledTableCell>
              <StyledTableCell>
                {new Date(invoice.dueDate).toLocaleDateString()}
              </StyledTableCell>
              <StyledTableCell>
                <Chip
                  label={invoice.paymentStatus}
                  size="small"
                  sx={{
                    backgroundColor: invoice.paymentStatus.toLowerCase() === 'paid' 
                      ? 'rgba(46, 213, 115, 0.15)' 
                      : 'rgba(255, 71, 87, 0.15)',
                    color: invoice.paymentStatus.toLowerCase() === 'paid' 
                      ? '#2ed573' 
                      : '#ff4757',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                  }}
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default InvoiceTable;
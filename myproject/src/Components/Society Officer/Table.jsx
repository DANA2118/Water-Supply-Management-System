import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function CustomizedTables() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
  
    axios.get("http://localhost:8082/api/customer/get", {
      headers: {
        "Authorization": `Bearer ${token}`, // Attach token here
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      setCustomers(response.data);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  };
  

  const handleDelete = (accountNo) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      axios.delete(`http://localhost:8082/api/customer/delete/${accountNo}`)
        .then(() => {
          alert("Customer deleted successfully");
          setCustomers(customers.filter(customer => customer.accountNo !== accountNo));
        })
        .catch(error => {
          console.error("Error deleting customer:", error);
          alert("Failed to delete customer");
        });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">Address</StyledTableCell>
            <StyledTableCell align="center">Account No</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <StyledTableRow key={customer.accountNo}>
              <StyledTableCell component="th" scope="row">
                {customer.name}
              </StyledTableCell>
              <StyledTableCell align="center">{customer.address}</StyledTableCell>
              <StyledTableCell align="center">{customer.accountNo}</StyledTableCell>
              <StyledTableCell align="center">{customer.status}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(customer.accountNo)}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
// PaymentVoucher.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "./voucher.css";

const PaymentVoucher = () => {
  const [voucher, setVoucher] = useState({
    payee: "",
    voucher_date: "",
    des: [{ description: "", cost: "" }],
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = voucher.des.reduce(
      (acc, line) => acc + parseFloat(line.cost || 0),
      0
    );
    setTotal(sum);
  }, [voucher.des]);

  const handleLineChange = (i, field, val) => {
    const lines = [...voucher.des];
    lines[i][field] = val;
    setVoucher({ ...voucher, des: lines });
  };

  const addLine = (i) => {
    const lines = [...voucher.des];
    lines.splice(i + 1, 0, { description: "", cost: "" });
    setVoucher({ ...voucher, des: lines });
  };

  const removeLine = (i) => {
    if (voucher.des.length === 1) return;
    const lines = voucher.des.filter((_, idx) => idx !== i);
    setVoucher({ ...voucher, des: lines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      payee: voucher.payee,
      voucher_date: voucher.voucher_date,
      des: voucher.des.map((l) => ({
        description: l.description,
        cost: parseFloat(l.cost),
      })),
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8082/api/paymentvoucher/save",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Voucher created!");
      setVoucher({
        payee: "",
        voucher_date: "",
        des: [{ description: "", cost: "" }],
      });
    } catch (err) {
      console.error(err);
      alert("Error creating voucher");
    }
  };

  return (
    <div className="paymentvoucher">
      <Header />
      <Sidebar />
      <div className="voucher-container">
        <form className="voucher-form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="voucher-input-box">
              <label>Date</label>
              <input
                type="date"
                value={voucher.voucher_date}
                onChange={(e) =>
                  setVoucher({ ...voucher, voucher_date: e.target.value })
                }
                required
              />
            </div>
            <div className="voucher-input-box">
              <label>Payee</label>
              <input
                type="text"
                placeholder="Payee"
                value={voucher.payee}
                onChange={(e) =>
                  setVoucher({ ...voucher, payee: e.target.value })
                }
                required
              />
            </div>
          </div>
          {voucher.des.map((line, idx) => (
            <div className="row line-row" key={idx}>
              <div className="voucher-input-box">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Description"
                  value={line.description}
                  onChange={(e) =>
                    handleLineChange(idx, "description", e.target.value)
                  }
                  required
                />
              </div>
              <div className="voucher-input-box">
                <label>Cost</label>
                <input
                  type="number"
                  placeholder="Cost"
                  value={line.cost}
                  onChange={(e) => handleLineChange(idx, "cost", e.target.value)}
                  required
                />
              </div>
              <IconButton size="small" disableRipple className="icon-btn remove" onClick={() => removeLine(idx)} title="Remove line">
                <RemoveIcon />
              </IconButton>
              <IconButton size="small" disableRipple className="icon-btn add" onClick={() => addLine(idx)} title="Add line">
                <AddIcon />
              </IconButton>
            </div>
          ))}

          {/* Total & Submit */}
          <div className="total-box">
            <label>Total Amount</label>
            <input type="text" value={total.toFixed(2)} readOnly />
          </div>
          <button type="submit" className="submit-btn">
            Save Voucher
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentVoucher;

import React from "react";
import "../styles/Receipt.css";

function Receipt({ billData }) {
  if (!billData) {
    return <p>No bill data available.</p>;
  }

  return (
    <div className="receipt-container">
      <h2>Bill Receipt</h2>

      <div className="receipt-details">
        <p><strong>Customer:</strong> {billData.customerName}</p>
        <p><strong>Date:</strong> {billData.date}</p>
        <p><strong>Bill No:</strong> {billData.billNo}</p>
      </div>

      <table className="receipt-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {billData.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.rate}</td>
              <td>{item.qty * item.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="receipt-total">
        Grand Total: ₹{billData.items.reduce((acc, item) => acc + item.qty * item.rate, 0)}
      </h3>
    </div>
  );
}

export default Receipt;

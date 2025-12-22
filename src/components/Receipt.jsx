import React from "react";
import "../styles/Receipt.css";

function Receipt({ billData, onClose }) {
  if (!billData) {
    return <p>No bill data available.</p>;
  }

  const {
    customerName,
    items,
    subtotal,
    discount,
    gst,
    total,
    paymentType,
  } = billData;

  return (
    <div className="receipt-container">
      {/* Buttons (hidden in print) */}
      <div className="no-print receipt-actions">
        <button onClick={() => window.print()}>🖨 Print</button>
        <button onClick={onClose}>Close</button>
      </div>

      <h2 className="receipt-title">TAX INVOICE</h2>

      {/* Header */}
      <div className="receipt-details">
        <p><strong>Customer:</strong> {customerName || "Walk-in Customer"}</p>
        <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
        <p><strong>Invoice No:</strong> INV-{Date.now()}</p>
        <p><strong>Payment:</strong> {paymentType}</p>
      </div>

      {/* Items Table */}
      <table className="receipt-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Rate (₹)</th>
            <th>Total (₹)</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="receipt-summary">
        <p>Subtotal: ₹{subtotal}</p>
        <p>Discount: {discount}%</p>
        <p>GST: ₹{gst}</p>
        <h3>Grand Total: ₹{total}</h3>
      </div>

      <p className="receipt-footer">
        ** This is a computer-generated receipt **
      </p>

      {/* Print Styles */}
      <style>
        {`
        @media print {
          .no-print {
            display: none;
          }
          body {
            background: white;
          }
        }
        `}
      </style>
    </div>
  );
}

export default Receipt;

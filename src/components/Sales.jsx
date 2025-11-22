import React, { useEffect, useState } from "react";

// Main colors from screenshot
const TABLE_HEADER_BG = "#1976d2";
const TABLE_BORDER = "#1565c0";
const ROW_ALT_BG = "#f5faff";

const Bearer_Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDMxNjI1NzAwMGY3MmEyN2Q0OWJkYiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzYzNzk4NTQyLCJleHAiOjE3NjM4ODQ5NDJ9.2pEp3GT5zvSVBW7c-Ua3pvp70CWTxodb9OVX9l0L-dY";
function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch("http://172.28.253.143:5000/api/sales", {
      headers: {
        Authorization: `Bearer ${Bearer_Token}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setSales(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{
      margin: "2rem auto",
      maxWidth: 1250,
      background: "white",
      borderRadius: 8,
      boxShadow: "0 4px 16px rgba(0,36,100,0.04)"
    }}>
      <h2 style={{
        padding: "1rem 2rem",
        color: TABLE_HEADER_BG,
        fontFamily: "sans-serif",
        fontWeight: 600,
        borderBottom: `3px solid ${TABLE_HEADER_BG}`
      }}>
        Sales Records
      </h2>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "sans-serif"
      }}>
        <thead>
          <tr style={{ background: TABLE_HEADER_BG, color: "#fff" }}>
            <th style={headerCell}>SN</th>
            <th style={headerCell}>Customer Name</th>
            <th style={headerCell}>Date</th>
            <th style={headerCell}>Products</th>
            <th style={headerCell}>Total Amount</th>
            <th style={headerCell}>Payment Method</th>
            <th style={headerCell}>Sale Type</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ padding: "2rem", textAlign: "center" }}>Loading...</td>
            </tr>
          ) : (
            sales.map((sale, idx) => (
              <tr key={sale._id} style={{
                background: idx % 2 ? ROW_ALT_BG : "white",
                borderBottom: `1px solid ${TABLE_BORDER}`
              }}>
                <td style={bodyCell}>{idx + 1}</td>
                <td style={bodyCell}>{sale.customerName}</td>
                <td style={bodyCell}>{new Date(sale.date).toLocaleString()}</td>
                <td style={bodyCell}>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {sale.products.map(prod => (
                      <li key={prod._id} style={{ lineHeight: "1.4", fontSize: "0.95rem" }}>
                        Product ID: {prod.productId}, Qty: {prod.quantity}, Price: ₹{prod.price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={bodyCell}>₹{sale.totalAmount}</td>
                <td style={bodyCell}>{sale.paymentMethod}</td>
                <td style={bodyCell}>{sale.saleType}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const headerCell = {
  padding: "12px 10px",
  borderRight: "1px solid #fff",
  fontSize: "1.05rem",
  fontWeight: 500,
  letterSpacing: "0.05em"
};

const bodyCell = {
  padding: "10px",
  borderRight: `1px solid ${TABLE_BORDER}`,
  verticalAlign: "top",
  fontSize: "0.97rem"
};

export default Sales;

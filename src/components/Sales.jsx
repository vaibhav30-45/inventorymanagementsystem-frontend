import React, { useEffect, useState } from "react";

// UI colors
const TABLE_HEADER_BG = "#1976d2";
const TABLE_BORDER = "#1565c0";
const ROW_ALT_BG = "#f5faff";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/sales`;

function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
     const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setLoading(false);
        return;
      }

      const res = await fetch(API_BASE, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch sales");
      }

      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        margin: "2rem auto",
        maxWidth: 1250,
        background: "white",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,36,100,0.04)",
      }}
    >
      <h2
        style={{
          padding: "1rem 2rem",
          color: TABLE_HEADER_BG,
          fontFamily: "sans-serif",
          fontWeight: 600,
          borderBottom: `3px solid ${TABLE_HEADER_BG}`,
        }}
      >
        Sales Records
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "sans-serif",
        }}
      >
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
          {loading && (
            <tr>
              <td colSpan={7} style={{ padding: "2rem", textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "red" }}>
                {error}
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            sales.map((sale, idx) => (
              <tr
                key={sale._id}
                style={{
                  background: idx % 2 ? ROW_ALT_BG : "white",
                  borderBottom: `1px solid ${TABLE_BORDER}`,
                }}
              >
                <td style={bodyCell}>{idx + 1}</td>
                <td style={bodyCell}>{sale.customerName || "-"}</td>
                <td style={bodyCell}>
                  {sale.date ? new Date(sale.date).toLocaleString() : "-"}
                </td>
                <td style={bodyCell}>
  <ul style={{ margin: 0, paddingLeft: 16 }}>
    {sale.products?.map((p, i) => (
      <li key={i} style={{ lineHeight: "1.4", fontSize: "0.95rem" }}>
        {p.productId?.name || "Product"} × {p.quantity} (₹{p.price})
      </li>
    ))}
  </ul>
</td>
                <td style={bodyCell}>₹{sale.totalAmount}</td>
                <td style={bodyCell}>{sale.paymentMethod}</td>
                <td style={bodyCell}>{sale.saleType}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const headerCell = {
  padding: "12px 10px",
  borderRight: "1px solid #fff",
  fontSize: "1.05rem",
  fontWeight: 500,
};

const bodyCell = {
  padding: "10px",
  borderRight: `1px solid ${TABLE_BORDER}`,
  verticalAlign: "top",
  fontSize: "0.97rem",
};

export default Sales;

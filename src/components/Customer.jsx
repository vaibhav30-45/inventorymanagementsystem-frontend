import React, { useEffect, useState } from "react";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/customers`;

export default function SalesRecords() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("authToken");
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
        throw new Error(err.message || "Failed to fetch customers");
      }

      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderRows = () => {
    if (!customers.length) {
      return (
        <tr>
          <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
            No records found
          </td>
        </tr>
      );
    }

    return customers.map((cust, idx) => {
      const name = cust.name || cust.basicDetails?.name || "-";

      const dateRaw =
        cust.purchaseHistory?.[0]?.date ||
        cust.oneTimeTransaction?.date ||
        null;

      const products =
        cust.purchaseHistory?.[0]?.products?.map(p => p.productId).join(", ") ||
        cust.oneTimeTransaction?.products?.map(p => p.productId).join(", ") ||
        "-";

      const totalAmount =
        cust.purchaseHistory?.[0]?.totalAmount ||
        cust.oneTimeTransaction?.totalAmount ||
        "-";

      const paymentMethod =
        cust.purchaseHistory?.[0]?.paymentMethod ||
        cust.oneTimeTransaction?.paymentMethod ||
        "-";

      return (
        <tr key={cust._id || idx}>
          <td>{idx + 1}</td>
          <td>{name}</td>
          <td>{formatDate(dateRaw)}</td>
          <td>{products}</td>
          <td>{totalAmount}</td>
          <td>{paymentMethod}</td>
        </tr>
      );
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ paddingBottom: 20 }}>Customer Records</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>SN</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      )}
    </div>
  );
}

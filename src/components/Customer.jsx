import React, { useEffect, useState } from "react";


const API_BASE = "http://172.28.253.143:5000/api/customers"; // update port/address if needed
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDMxNjI1NzAwMGY3MmEyN2Q0OWJkYiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzYzNzk4NTQyLCJleHAiOjE3NjM4ODQ5NDJ9.2pEp3GT5zvSVBW7c-Ua3pvp70CWTxodb9OVX9l0L-dY";

export default function SalesRecords() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error fetching customers");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; 
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`; 
};


  
  const renderRows = () => {
    if (!customers.length)
      return (
        <tr>
          <td colSpan="7" style={{ textAlign: "center" }}>
            No records found
          </td>
        </tr>
      );
    return customers.map((cust, idx) => {

     
      const name =
        cust.name || cust.basicDetails?.name || "-";
      const dateRaw =
  cust.purchaseHistory?.[0]?.date ||
  cust.oneTimeTransaction?.date ||
  "-";
const date = formatDate(dateRaw);

      const products =
        (cust.purchaseHistory?.[0]?.products &&
          cust.purchaseHistory[0].products
            .map((p) => p.productId)
            .join(", ")) ||
        (cust.oneTimeTransaction?.products &&
          cust.oneTimeTransaction.products
            .map((p) => p.productId)
            .join(", ")) ||
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
          <td>{date}</td>
          <td>{products}</td>
          <td>{totalAmount}</td>
          <td>{paymentMethod}</td>
        
        </tr>
      );
    });
  };

  return (
    <div className="sales-records-container" style={{ padding: 20 }}>
      <h2 style={{paddingBottom:20}}>Customer Records</h2>
      {loading && <p>Loading...</p>}
      
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
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
    </div>
  );
}

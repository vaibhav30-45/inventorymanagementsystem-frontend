import React, { useEffect, useState } from "react";

const API_BASE = "http://172.28.253.143:5000/api/products";
// const token =
//   localStorage.getItem("authToken") ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDMxNjI1NzAwMGY3MmEyN2Q0OWJkYiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzYzNzk4NTQyLCJleHAiOjE3NjM4ODQ5NDJ9.2pEp3GT5zvSVBW7c-Ua3pvp70CWTxodb9OVX9l0L-dY";

export default function Pesticide() {
  const [pesticides, setPesticides] = useState([]);
  const [allPesticides, setAllPesticides] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchPesticides();
  }, []);

  const fetchPesticides = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const items = Array.isArray(data) ? data : data.data || [];

      const filtered = items.filter(
        (item) => item.category?.toLowerCase() === "pesticide"
      );

      setPesticides(filtered);
      setAllPesticides(filtered);
    } catch (err) {
      console.error("Error loading pesticides:", err);
    }
    setLoading(false);
  };

 
  const handleSearch = () => {
    const text = searchText.trim().toLowerCase();

    if (text === "") {
      setPesticides(allPesticides);
      return;
    }

    const filtered = allPesticides.filter(
      (item) =>
        item.name?.toLowerCase().includes(text) ||
        item.description?.toLowerCase().includes(text)
    );

    setPesticides(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const renderRows = () => {
    if (!pesticides.length)
      return (
        <tr>
          <td colSpan="8" style={{ textAlign: "center" }}>
            No Pesticide Products Found
          </td>
        </tr>
      );

    return pesticides.map((item, idx) => (
      <tr key={item._id}>
        <td>{idx + 1}</td>
        <td>{item.name}</td>
        <td>₹{item.sellingPrice}</td>
        <td>{item.purchasePrice ? `₹${item.purchasePrice}` : "-"}</td>
        <td>{item.discount ?? "-"}</td>
        <td>{item.quantity ?? 0}</td>
        <td>{item.description ?? "-"}</td>
        <td>
          <button>Edit</button>
          <button style={{ marginLeft: 8 }}>Delete</button>
        </td>
      </tr>
    ));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pesticide Products</h1>

      {/* SEARCH BAR */}
      <div style={{ margin: "15px 0", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search item..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>Selling</th>
            <th>Purchase</th>
            <th>Discount</th>
            <th>Qty</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
}
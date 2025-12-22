import React, { useEffect, useState } from "react";
const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products`;

export default function Hardware() {
  const [hardware, setHardware] = useState([]);
  const [allHardware, setAllHardware] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchHardware();
  }, []);

  const fetchHardware = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await fetch(API_BASE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch hardware");
      }

      const data = await response.json();

      // filter only hardware from MongoDB
      const filtered = data.filter(
        (item) => item.category?.toLowerCase() === "hardware"
      );

      setHardware(filtered);
      setAllHardware(filtered);
    } catch (err) {
      console.error("Error loading hardware:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search
  const handleSearch = () => {
    const text = searchText.trim().toLowerCase();
    if (!text) {
      setHardware(allHardware);
      return;
    }

    const filtered = allHardware.filter(
      (item) =>
        item.name?.toLowerCase().includes(text) ||
        item.description?.toLowerCase().includes(text)
    );

    setHardware(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const renderRows = () => {
    if (!hardware.length) {
      return (
        <tr>
          <td colSpan="8" style={{ textAlign: "center" }}>
            No Hardware Products Found
          </td>
        </tr>
      );
    }

    return hardware.map((item, idx) => (
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
      <h1>Hardware Products</h1>

      <div style={{ margin: "15px 0", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search item..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ padding: 8, backgroundColor: "#ccc",width: 250 }}
        />
        <button onClick={handleSearch}>Search</button>
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

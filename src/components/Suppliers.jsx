import React, { useState, useEffect } from "react";

const API_BASE = "http://172.28.253.143:5000/api/suppliers";
// const token =
  // localStorage.getItem("authToken") ||
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDMxNjI1NzAwMGY3MmEyN2Q0OWJkYiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzYzNzk4NTQyLCJleHAiOjE3NjM4ODQ5NDJ9.2pEp3GT5zvSVBW7c-Ua3pvp70CWTxodb9OVX9l0L-dY";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      const list = Array.isArray(data) ? data : data.data || [];

      setSuppliers(list);
      setFiltered(list);
    } catch (err) {
      console.error("Error loading suppliers:", err);
    }
    setLoading(false);
  };

  
  const handleSearch = () => {
    const keyword = search.toLowerCase();
    const results = suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.email.toLowerCase().includes(keyword) ||
        s.phone.toLowerCase().includes(keyword)
    );
    setFiltered(results);
  };

 
  const openAddModal = () => {
    setForm({ name: "", email: "", phone: "", address: "" });
    setEditingSupplier(null);
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    });
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const saveSupplier = async () => {
    const method = editingSupplier ? "PUT" : "POST";
    const url = editingSupplier
      ? `${API_BASE}/${editingSupplier._id}`
      : API_BASE;

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      console.error("Error saving supplier:", err);
    }
  };

  // Delete Supplier
  const deleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;

    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Supplier Management</h1>
    </div>

      
<div
  style={{
    margin: "15px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  }}
>
  
  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <input
      type="text"
      placeholder="Search Suppliers..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "260px",
        padding: 8,
        border: "1px solid #ccc",
        borderRadius: 4
      }}
    />
    <button
      onClick={handleSearch}
      style={{
        padding: "9px 14px",
        background: "#2196f3",
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor: "pointer"
      }}
    >
      Search
    </button>
  </div>


  <button
    style={{
      padding: "10px 18px",
      background: "#4caf50",
      color: "white",
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      marginLeft: "auto"
    }}
    onClick={openAddModal}
  >
    + Add Supplier
  </button>
</div>


      {loading && <p>Loading...</p>}

      
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No Suppliers Found
              </td>
            </tr>
          ) : (
            filtered.map((sup, idx) => (
              <tr key={sup._id}>
                <td>{idx + 1}</td>
                <td>{sup.name}</td>
                <td>{sup.email}</td>
                <td>{sup.phone}</td>
                <td>{sup.address}</td>
                <td>
                  <button
                    style={{ marginRight: 8 }}
                    onClick={() => openEditModal(sup)}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteSupplier(sup._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              width: 350,
              borderRadius: 8
            }}
          >
            <h3>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</h3>

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <textarea
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <button
              style={{
                width: "100%",
                background: "#2196f3",
                color: "white",
                padding: 10,
                border: "none",
                borderRadius: 5,
                marginBottom: 10
              }}
              onClick={saveSupplier}
            >
              Save
            </button>

            <button
              style={{
                width: "100%",
                background: "gray",
                color: "white",
                padding: 10,
                border: "none",
                borderRadius: 5
              }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
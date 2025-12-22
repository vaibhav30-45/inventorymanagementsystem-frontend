import React, { useState, useEffect } from "react";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/suppliers`;

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

  // 🔑 AUTH HEADER
  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login again");
      throw new Error("No token");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // 📦 FETCH SUPPLIERS
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        headers: getAuthHeader(),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch suppliers");
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data || [];

      setSuppliers(list);
      setFiltered(list);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 SEARCH
  const handleSearch = () => {
    const keyword = search.toLowerCase();
    const results = suppliers.filter(
      (s) =>
        s.name?.toLowerCase().includes(keyword) ||
        s.email?.toLowerCase().includes(keyword) ||
        s.phone?.toLowerCase().includes(keyword)
    );
    setFiltered(results);
  };

  // ➕ ADD MODAL
  const openAddModal = () => {
    setForm({ name: "", email: "", phone: "", address: "" });
    setEditingSupplier(null);
    setShowModal(true);
  };

  // ✏️ EDIT MODAL
  const openEditModal = (supplier) => {
    setForm(supplier);
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  // 💾 SAVE
  const saveSupplier = async () => {
    const method = editingSupplier ? "PUT" : "POST";
    const url = editingSupplier
      ? `${API_BASE}/${editingSupplier._id}`
      : API_BASE;

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeader(),
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");

      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🗑 DELETE
  const deleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      fetchSuppliers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Supplier Management</h1>

      <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0" }}>
        <div>
          <input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: 8 }}
          />
          <button onClick={handleSearch} style={{ marginLeft: 8 }}>
            Search
          </button>
        </div>

        <button onClick={openAddModal}>+ Add Supplier</button>
      </div>

      {loading && <p>Loading...</p>}

      <table width="100%" border="1">
        <thead>
          <tr>
            <th>#</th>
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
              <td colSpan="6" align="center">No Suppliers Found</td>
            </tr>
          ) : (
            filtered.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.address}</td>
                <td>
                  <button onClick={() => openEditModal(s)}>Edit</button>
                  <button onClick={() => deleteSupplier(s._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "#fff", padding: 20, width: 350 }}>
            <h3>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</h3>

            {["name", "email", "phone", "address"].map((f) => (
              <input
                key={f}
                placeholder={f}
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                style={{ width: "100%", marginBottom: 8 }}
              />
            ))}

            <button onClick={saveSupplier}>Save</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "../styles/Product.css";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products`;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [hardware, setHardware] = useState([]);
  const [pesticides, setPesticides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: "",
    category: "Hardware",
    sellingPrice: "",
    purchasePrice: "",
    discount: "",
    quantity: "",
    description: "",
  };

  const [form, setForm] = useState(initialForm);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 FETCH FROM MONGO
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please login again");

      const res = await fetch(API_BASE, {
        method: "GET",
        headers: getAuthHeader(),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
      splitCategory(data);
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const splitCategory = (items) => {
    setHardware(items.filter(p => p.category?.toLowerCase() === "hardware"));
    setPesticides(items.filter(p => p.category?.toLowerCase() === "pesticide"));
  };

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name || !form.sellingPrice) {
      alert("Name & Selling Price required");
      return;
    }

    const payload = {
      ...form,
      sellingPrice: Number(form.sellingPrice),
      purchasePrice: Number(form.purchasePrice || 0),
      discount: Number(form.discount || 0),
      quantity: Number(form.quantity || 0),
    };

    try {
      const res = await fetch(
        editingId ? `${API_BASE}/${editingId}` : API_BASE,
        {
          method: editingId ? "PUT" : "POST",
          headers: getAuthHeader(),
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = (list) => {
    return list.filter(p =>
      (categoryFilter === "all" || p.category.toLowerCase() === categoryFilter) &&
      (!query || p.name.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const renderRows = (list) =>
    filtered(list).map((p, i) => (
      <tr key={p._id}>
        <td>{i + 1}</td>
        <td>{p.name}</td>
        <td>₹{p.sellingPrice}</td>
        <td>{p.purchasePrice ? `₹${p.purchasePrice}` : "-"}</td>
        <td>{p.discount || "-"}</td>
        <td>{p.quantity}</td>
        <td>{p.description || "-"}</td>
        <td>
          <button onClick={() => { setEditingId(p._id); setForm(p); }}>
            Edit
          </button>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </td>
      </tr>
    ));

  return (
    <div className="product-container">
      <h1>Products</h1>

      <div className="search-filter">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
        />

        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="hardware">Hardware</option>
          <option value="pesticide">Pesticide</option>
        </select>
      </div>

      <div className="product-form">
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSave}>
          <div className="form-row">
            <input 
              name="name"
              value={form.name} 
              onChange={handleForm} 
              placeholder="Product Name" 
              required
            />
            
            <select name="category" value={form.category} onChange={handleForm}>
              <option value="Hardware">Hardware</option>
              <option value="Pesticide">Pesticide</option>
            </select>
          </div>

          <div className="form-row">
            <input 
              name="sellingPrice"
              type="number"
              value={form.sellingPrice} 
              onChange={handleForm} 
              placeholder="Selling Price" 
              required
            />
            
            <input 
              name="purchasePrice"
              type="number"
              value={form.purchasePrice} 
              onChange={handleForm} 
              placeholder="Purchase Price" 
            />
          </div>

          <div className="form-row">
            <input 
              name="discount"
              type="number"
              value={form.discount} 
              onChange={handleForm} 
              placeholder="Discount (%)" 
            />
            
            <input 
              name="quantity"
              type="number"
              value={form.quantity} 
              onChange={handleForm} 
              placeholder="Quantity" 
            />
          </div>

          <div className="form-row">
            <textarea 
              name="description"
              value={form.description} 
              onChange={handleForm} 
              placeholder="Description" 
              rows="2"
            />
          </div>

          <div className="form-buttons">
            <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
            {editingId && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <h2>Hardware Products ({hardware.length})</h2>
          {hardware.length > 0 ? (
            <table className="product-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Selling Price</th>
                  <th>Purchase Price</th>
                  <th>Discount</th>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{renderRows(hardware)}</tbody>
            </table>
          ) : (
            <p>No hardware products found.</p>
          )}

          <h2>Pesticide Products ({pesticides.length})</h2>
          {pesticides.length > 0 ? (
            <table className="product-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Selling Price</th>
                  <th>Purchase Price</th>
                  <th>Discount</th>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{renderRows(pesticides)}</tbody>
            </table>
          ) : (
            <p>No pesticide products found.</p>
          )}
        </>
      )}
    </div>
  );
}
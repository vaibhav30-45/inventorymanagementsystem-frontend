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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token");

      const res = await fetch(API_BASE, { // removed extra /products
        headers: getAuthHeader(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await res.json();
      const items = Array.isArray(data) ? data : data.data || [];
      setProducts(items);
      splitCategory(items);
    } catch (err) {
      console.error("Failed to load products:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const splitCategory = (items) => {
    setHardware(items.filter((p) => p.category?.toLowerCase() === "hardware"));
    setPesticides(items.filter((p) => p.category?.toLowerCase() === "pesticide"));
  };

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.sellingPrice) {
      alert("Name and Selling Price are required.");
      return;
    }

    const payload = {
      name: form.name,
      category: form.category,
      sellingPrice: Number(form.sellingPrice),
      purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : 0,
      discount: form.discount ? Number(form.discount) : 0,
      quantity: form.quantity ? Number(form.quantity) : 0,
      description: form.description,
    };

    try {
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message || "Operation failed");

      alert(resJson.message || (editingId ? "Updated successfully" : "Added successfully"));
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      category: p.category,
      sellingPrice: p.sellingPrice,
      purchasePrice: p.purchasePrice,
      discount: p.discount,
      quantity: p.quantity,
      description: p.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message || "Delete failed");

      alert(resJson.message || "Deleted successfully");

      const updatedProducts = products.filter((p) => p._id !== id);
      setProducts(updatedProducts);
      splitCategory(updatedProducts);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const filtered = (list) => {
    let res = list;
    if (categoryFilter !== "all") {
      res = res.filter((p) => p.category.toLowerCase() === categoryFilter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return res;
  };

  const renderTable = (data) => {
    const items = filtered(data);
    if (!items.length)
      return (
        <tr>
          <td colSpan="8">No Products Found</td>
        </tr>
      );

    return items.map((p, i) => (
      <tr key={p._id}>
        <td>{i + 1}</td>
        <td>{p.name}</td>
        <td>₹{p.sellingPrice}</td>
        <td>{p.purchasePrice ? `₹${p.purchasePrice}` : "-"}</td>
        <td>{p.discount ?? "-"}</td>
        <td>{p.quantity ?? 0}</td>
        <td>{p.description ?? "-"}</td>
        <td>
          <button onClick={() => startEdit(p)}>Edit</button>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="product-container">
      <h1>Products Management</h1>

      <div className="filters">
        <input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="hardware">Hardware</option>
          <option value="pesticide">Pesticide</option>
        </select>
        <button onClick={() => { setQuery(""); setCategoryFilter("all"); }}>Reset</button>
      </div>

      <div className="product-form">
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={handleSave}>
          <div className="form-row">
            <input name="name" placeholder="Product Name" value={form.name} onChange={handleForm} />
            <select name="category" value={form.category} onChange={handleForm}>
              <option value="Hardware">Hardware</option>
              <option value="Pesticide">Pesticide</option>
            </select>
            <input name="sellingPrice" placeholder="Selling Price" value={form.sellingPrice} onChange={handleForm} />
            <input name="purchasePrice" placeholder="Purchase Price" value={form.purchasePrice} onChange={handleForm} />
            <input name="discount" placeholder="Discount" value={form.discount} onChange={handleForm} />
            <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleForm} />
          </div>

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleForm} />

          <div className="form-actions">
            <button type="submit">{editingId ? "Update" : "Add"}</button>
            {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <h2>Hardware Products</h2>
      <table>
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
        <tbody>{renderTable(hardware)}</tbody>
      </table>

      <h2>Pesticide Products</h2>
      <table>
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
        <tbody>{renderTable(pesticides)}</tbody>
      </table>
    </div>
  );
}

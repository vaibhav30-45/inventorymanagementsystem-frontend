import React, { useEffect, useState } from "react";
import "../styles/Inventory.css"; // keep or remove, no design dependency

const API_BASE = "http://10.223.3.143:5000/api/products";
const token = localStorage.getItem("authToken") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDMxNjI1NzAwMGY3MmEyN2Q0OWJkYiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzYzNTU0MTgzLCJleHAiOjE3NjM2NDA1ODN9.jwkjhiLnRqf3I0kiXzYIHFFcBNWPx43Yk6VeewHqkHc"; // or hardcode token for testing

export default function Inventory() {
  const [allProducts, setAllProducts] = useState([]); // full list from backend
  const [hardware, setHardware] = useState([]);
  const [pesticides, setPesticides] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search / filter
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // all / hardware / pesticide

  // Add/Edit form state
  const initialForm = {
    name: "",
    category: "Hardware", // or "Pesticide"
    sellingPrice: "",
    purchasePrice: "",
    discount: "",
    quantity: "",
    description: "",
  };
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null); // null => add mode, otherwise edit mode
  const [saving, setSaving] = useState(false);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      // data may be array or { success:true, data: [...] }
      const items = Array.isArray(data) ? data : data.data || [];
      setAllProducts(items);
      splitCategories(items);
    } catch (err) {
      console.error(err);
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const splitCategories = (items) => {
    const hw = items.filter((i) => String(i.category).toLowerCase() === "hardware");
    const ps = items.filter((i) => String(i.category).toLowerCase() === "pesticide");
    setHardware(hw);
    setPesticides(ps);
  };

  // Search + category filter applied view
  const applyFilters = (list) => {
    let result = list;
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === categoryFilter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }
    return result;
  };

  // Handle form field change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    // basic validation
    if (!form.name || !form.sellingPrice) {
      alert("Name and selling price are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        sellingPrice: Number(form.sellingPrice),
        purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : undefined,
        discount: form.discount ? Number(form.discount) : 0,
        quantity: form.quantity ? Number(form.quantity) : 0,
        description: form.description || "",
      };

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        const msg = resJson?.message || "Add product failed";
        alert(msg);
        return;
      }

      // success — refresh list (or optimistically add)
      alert(resJson.message || "Product added successfully");
      setForm(initialForm);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    } finally {
      setSaving(false);
    }
  };

  // Start editing
  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      category: product.category || "Hardware",
      sellingPrice: product.sellingPrice ?? "",
      purchasePrice: product.purchasePrice ?? "",
      discount: product.discount ?? "",
      quantity: product.quantity ?? "",
      description: product.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // bring form into view
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    if (!form.name || !form.sellingPrice) {
      alert("Name and selling price are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        sellingPrice: Number(form.sellingPrice),
        purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : undefined,
        discount: form.discount ? Number(form.discount) : 0,
        quantity: form.quantity ? Number(form.quantity) : 0,
        description: form.description || "",
      };

      const res = await fetch(`${API_BASE}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        alert(resJson?.message || "Update failed");
        return;
      }

      alert(resJson.message || "Product updated");
      setEditingId(null);
      setForm(initialForm);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const resJson = await res.json();
      if (!res.ok) {
        alert(resJson?.message || "Delete failed");
        return;
      }
      alert(resJson.message || "Product deleted");
      // remove locally for instant feedback
      setAllProducts((prev) => prev.filter((p) => p._id !== id));
      splitCategories(allProducts.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  // Render helpers
  const renderTable = (list) => {
    const view = applyFilters(list);
    if (!view.length) return <tr><td colSpan="7">No items found</td></tr>;
    return view.map((item, idx) => (
      <tr key={item._id}>
        <td>{idx + 1}</td>
        <td>{item.name}</td>
        <td>₹{item.sellingPrice}</td>
        <td>{item.purchasePrice ? `₹${item.purchasePrice}` : "-"}</td>
        <td>{item.discount ?? "-"}</td>
        <td>{item.quantity ?? 0}</td>
        <td>{item.description ?? "-"}</td>
        <td>
          <button onClick={() => startEdit(item)}>Edit</button>
          <button onClick={() => handleDelete(item._id)} style={{marginLeft:8}}>Delete</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="inventory-container" style={{ padding: 20 }}>
      <h1>Inventory Management</h1>

      {/* Search & Category Filter */}
      <div className="search-filter">
        <input
          placeholder="Search by name, description or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select 
        value={categoryFilter} 
        onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="hardware">Hardware</option>
          <option value="pesticide">Pesticide</option>
        </select>
        <button onClick={() => { setQuery(""); setCategoryFilter("all"); }}>Reset</button>
      </div>

      {/* Add / Edit Form */}
      <div className="product-form">
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={editingId ? handleUpdateProduct : handleAddProduct}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} style={{ padding:8, minWidth:200 }} />
            <select name="category" value={form.category} onChange={handleFormChange} style={{ padding:8 }}>
              <option value="Hardware">Hardware</option>
              <option value="Pesticide">Pesticide</option>
            </select>
            <input name="sellingPrice" placeholder="Selling Price" value={form.sellingPrice} onChange={handleFormChange} style={{ padding:8 }} />
            <input name="purchasePrice" placeholder="Purchase Price" value={form.purchasePrice} onChange={handleFormChange} style={{ padding:8 }} />
            <input name="discount" placeholder="Discount" value={form.discount} onChange={handleFormChange} style={{ padding:8 }} />
            <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleFormChange} style={{ padding:8 }} />
          </div>
          <div style={{ marginTop: 8 }}>
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleFormChange} style={{ width:"100%", padding:8, minHeight:60 }} />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" disabled={saving}>{saving ? "Saving..." : (editingId ? "Update Product" : "Add Product")}</button>
            {editingId && <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancel</button>}
          </div>
        </form>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Hardware Table */}
      <div className="table-section" style={{ marginBottom: 30 }}>
        <h2>Hardware Products</h2>
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
          <tbody>
            {renderTable(hardware)}
          </tbody>
        </table>
      </div>

      {/* Pesticide Table */}
      <div className="table-section">
        <h2>Pesticide Products</h2>
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
          <tbody>
            {renderTable(pesticides)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

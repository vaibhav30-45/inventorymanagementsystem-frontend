import React, { useEffect, useState } from "react";
import "../styles/Purchasing.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Purchasing() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= AUTH HEADER ================= */
  const getAuthHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API_BASE}/suppliers`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch {
      alert("Failed to load suppliers");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      alert("Failed to load products");
    }
  };

  /* ================= ADD ITEM ================= */
  const addItem = () => {
    if (!productId || !qty) {
      alert("Select product and quantity");
      return;
    }

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const price = product.purchasePrice || 0;
    const amount = qty * price;

    const newItem = {
      id: Date.now(),
      product: productId,
      productName: product.name,
      qty: Number(qty),
      price,
      amount,
    };

    setItems([...items, newItem]);
    setProductId("");
    setQty("");
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  /* ================= TOTAL ================= */
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  /* ================= SUBMIT PURCHASE ================= */
  const submitPurchase = async () => {
    if (!supplier || items.length === 0) {
      alert("Select supplier and add items");
      return;
    }

    setLoading(true);

    const payload = {
      supplier,
      items: items.map((i) => ({
        product: i.product,
        qty: i.qty,
        price: i.price,
      })),
    };

    try {
      const res = await fetch(`${API_BASE}/purchases`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Purchase saved successfully");
      setSupplier("");
      setItems([]);
    } catch (err) {
      alert(err.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="purchase-container">
      <h1>Purchasing</h1>

      {/* SUPPLIER */}
      <div className="purchase-card">
        <h3>Supplier</h3>
        <select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* ADD PRODUCT */}
      <div className="purchase-card">
        <h3>Add Product</h3>

        <div className="add-form">
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Qty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          {/* AUTO PRICE DISPLAY */}
          <input
            type="number"
            placeholder="Price"
            value={
              productId
                ? products.find((p) => p._id === productId)?.purchasePrice || 0
                : ""
            }
            disabled
          />

          <button className="btn-add" onClick={addItem}>
            Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="purchase-card">
        <h3>Purchase Items</h3>

        <table className="purchase-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Remove</th>
            </tr>
          </thead>

          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.productName}</td>
                <td>{i.qty}</td>
                <td>₹{i.price}</td>
                <td>₹{i.amount}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(i.id)}
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="purchase-total">
          <h2>Total: ₹{total}</h2>
        </div>

        <button
          className="btn-submit"
          onClick={submitPurchase}
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit Purchase"}
        </button>
      </div>
    </div>
  );
}

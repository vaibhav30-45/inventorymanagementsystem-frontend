import React, { useState } from "react";
import "../styles/Purchasing.css";

export default function Purchasing() {
  const [supplier, setSupplier] = useState("");
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);

  const addItem = () => {
    if (!product || !qty || !price) return;

    const newItem = {
      id: Date.now(),
      product,
      qty: Number(qty),
      price: Number(price),
      amount: Number(qty) * Number(price),
    };

    setItems([...items, newItem]);
    setProduct("");
    setQty("");
    setPrice("");
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="purchase-container">
      <h1>Purchasing</h1>

      {/* Supplier */}
      <div className="purchase-card">
        <h3>Supplier Details</h3>
        <select
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        >
          <option value="">Select Supplier</option>
          <option value="Supplier A">Supplier A</option>
          <option value="Supplier B">Supplier B</option>
        </select>
      </div>

      {/* Add Items */}
      <div className="purchase-card">
        <h3>Add Product</h3>

        <div className="add-form">
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option value="">Select Product</option>
            <option value="Pesticide">Pesticide</option>
            <option value="Hardware Product">Hardware Product</option>
          </select>

          <input
            type="number"
            placeholder="Qty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button className="btn-add" onClick={addItem}>Add</button>
        </div>
      </div>

      {/* Table */}
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
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.product}</td>
                <td>{item.qty}</td>
                <td>₹{item.price}</td>
                <td>₹{item.amount}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="purchase-total">
          <h2>Total: ₹{total}</h2>
        </div>

        <button className="btn-submit">
          Submit Purchase
        </button>
      </div>
    </div>
  );
}

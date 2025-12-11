import React, { useState, useEffect } from "react";

const API_PRODUCTS = "http://172.28.253.143:5000/api/inventory";
const API_SALES = "http://172.28.253.143:5000/api/sales";
const API_CUSTOMERS = "http://172.28.253.143:5000/api/customers";

const token = localStorage.getItem("authToken");

export default function Billing() {
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [discount, setDiscount] = useState(0);
  const [gstRate] = useState(18); // fixed GST

  const [paymentType, setPaymentType] = useState("Cash");

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  const loadProducts = async () => {
    const res = await fetch(API_PRODUCTS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data.data || []);
    setFilteredProducts(data.data || []);
  };

  const loadCustomers = async () => {
    const res = await fetch(API_CUSTOMERS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCustomers(data.data || []);
  };

  // Search Products
  const handleSearchProducts = () => {
    const key = productSearch.toLowerCase();
    const result = products.filter(
      (p) =>
        p.itemName.toLowerCase().includes(key) ||
        p.category.toLowerCase().includes(key)
    );
    setFilteredProducts(result);
  };

  const addToCart = (product) => {
    const exists = cart.find((c) => c._id === product._id);
    if (exists) {
      alert("Item already added");
      return;
    }

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1,
        total: product.price,
      },
    ]);
  };

  // Update Quantity
  const updateQuantity = (id, qty) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? { ...item, quantity: qty, total: qty * item.price }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((i) => i._id !== id));
  };

  // Bill Summary
  const subtotal = cart.reduce((sum, i) => sum + i.total, 0);
  const gst = (subtotal * gstRate) / 100;
  const discounted = subtotal - (subtotal * discount) / 100;
  const grandTotal = discounted + gst;

  // Save Bill
  const saveBill = async () => {
    if (cart.length === 0) return alert("Add items");

    const body = {
      customerId: selectedCustomer,
      items: cart.map((i) => ({
        productId: i._id,
        name: i.itemName,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      discount,
      gst,
      total: grandTotal,
      paymentType,
    };

    const res = await fetch(API_SALES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("Invoice Generated Successfully!");
      window.print(); 
      setCart([]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Billing System</h1>

      {/* Product Search */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <input
          type="text"
          placeholder="Search Products..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          style={{ padding: 8, width: 250 }}
        />
        <button
          onClick={handleSearchProducts}
          style={{
            padding: "9px 14px",
            background: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          Search
        </button>
      </div>

      {/* Product List */}
      <h3 style={{ marginTop: 20 }}>Available Products</h3>
      <table style={{ width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Price</th>
            <th>Add</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p._id}>
              <td>{p.itemName}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>
                <button onClick={() => addToCart(p)}>Add</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cart Table */}
      <h2 style={{ marginTop: 30 }}>Cart Items</h2>
      <table style={{ width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {cart.map((c) => (
            <tr key={c._id}>
              <td>{c.itemName}</td>
              <td>{c.price}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={c.quantity}
                  onChange={(e) => updateQuantity(c._id, Number(e.target.value))}
                  style={{ width: 60 }}
                />
              </td>
              <td>{c.total}</td>
              <td>
                <button onClick={() => removeItem(c._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Customer Selection */}
      <div style={{ marginTop: 20 }}>
        <h3>Select Customer</h3>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          style={{ padding: 8, width: 250 }}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bill Summary */}
      <div style={{ marginTop: 20 }}>
        <h3>Billing Summary</h3>
        <p>Subtotal: ₹{subtotal}</p>
        <p>
          Discount (%):
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            style={{ width: 80, marginLeft: 10 }}
          />
        </p>
        <p>GST ({gstRate}%): ₹{gst}</p>
        <h2>Grand Total: ₹{grandTotal}</h2>
      </div>

      {/* Payment */}
      <div style={{ marginTop: 20 }}>
        <h3>Payment Method</h3>
        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          style={{ padding: 8, width: 200 }}
        >
          <option>Cash</option>
          <option>Card</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Generate Bill */}
      <button
        onClick={saveBill}
        style={{
          marginTop: 30,
          background: "green",
          color: "white",
          padding: "12px 20px",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        Generate Invoice
      </button>
    </div>
  );
}
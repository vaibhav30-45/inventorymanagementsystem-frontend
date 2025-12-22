import React, { useEffect, useState } from "react";
import Receipt from "./Receipt";
import "../styles/Billing.css";
const API_PRODUCTS = "http://localhost:5000/api/products";
const API_SALES = "http://localhost:5000/api/sales";
const API_CUSTOMERS = "http://localhost:5000/api/customers";

export default function Billing() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [discount, setDiscount] = useState(0);
  const gstRate = 18;
  const [paymentMethod, setPaymentMethod] = useState("Cash");
const [showReceipt, setShowReceipt] = useState(false);
const [billData, setBillData] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  /* ================= LOAD DATA ================= */

  const loadProducts = async () => {
    const res = await fetch(API_PRODUCTS, {
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},

    });
    const data = await res.json();
    setProducts(data);
    setFilteredProducts(data);
  };

  const loadCustomers = async () => {
    const res = await fetch(API_CUSTOMERS, {
     headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},

    });
    const data = await res.json();
    setCustomers(data);
  };

  /* ================= SEARCH ================= */

  const searchProducts = () => {
    const key = search.toLowerCase();
    setFilteredProducts(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(key) ||
          p.category.toLowerCase().includes(key)
      )
    );
  };

  /* ================= CART ================= */

  const addToCart = (product) => {
    if (cart.find((c) => c._id === product._id)) return;

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1,
        total: product.sellingPrice,
      },
    ]);
  };

  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: qty,
              total: qty * item.sellingPrice,
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((i) => i._id !== id));
  };

  /* ================= BILL CALC ================= */

  const subtotal = cart.reduce((s, i) => s + i.total, 0);
  const discountAmt = (subtotal * discount) / 100;
  const gst = ((subtotal - discountAmt) * gstRate) / 100;
  const grandTotal = subtotal - discountAmt + gst;

  /* ================= SAVE BILL ================= */

  const generateBill = async () => {
  if (!cart.length || !selectedCustomer) {
    alert("Add items and select customer");
    return;
  }

 const selectedCustomerObj = customers.find(
  (c) => c._id === selectedCustomer
);

const payload = {
  customerId: selectedCustomer,
  customerName: selectedCustomerObj?.name || "Walk-in Customer",
  saleType: "Billing",
  products: cart.map((i) => ({
    productId: i._id,
    quantity: i.quantity,
    price: i.sellingPrice,
  })),
  totalAmount: grandTotal,
  paymentMethod,
};



  const res = await fetch(API_SALES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const savedBill = await res.json();

    // 👇 Prepare receipt data
    setBillData({
      customerName:
        customers.find((c) => c._id === selectedCustomer)?.name || "Customer",
      date: new Date().toLocaleString(),
      billNo: savedBill._id || Date.now(),
      items: payload.products,
    });

    setShowReceipt(true);
    setCart([]);
  } else {
    alert("Failed to generate invoice");
  }
};


  /* ================= UI ================= */

return (

  <div style={{ padding: 20 }}>
    <h1>Billing</h1>

    {/* SEARCH */}
    <input name="search"
      placeholder="Search products"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button onClick={searchProducts}>Search</button>

    {/* PRODUCT LIST */}
    <table width="100%">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Add</th>
        </tr>
      </thead>
      <tbody>
        {filteredProducts.map((p) => (
          <tr key={p._id}>
            <td>{p.name}</td>
            <td>{p.category}</td>
            <td>₹{p.sellingPrice}</td>
            <td>
              <button onClick={() => addToCart(p)}>Add</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* CART */}
    <h3>Cart</h3>
    <table width="100%">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {cart.map((c) => (
          <tr key={c._id}>
            <td>{c.name}</td>
            <td>₹{c.sellingPrice}</td>
            <td>
              <input
                type="number"
                min="1"
                value={c.quantity}
                onChange={(e) => updateQty(c._id, Number(e.target.value))}
              />
            </td>
            <td>₹{c.total}</td>
            <td>
              <button onClick={() => removeItem(c._id)}>X</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* CUSTOMER */}
    <select onChange={(e) => setSelectedCustomer(e.target.value)}>
      <option value="">Select Customer</option>
      {customers.map((c) => (
        <option key={c._id} value={c._id}>
          {c.name}
        </option>
      ))}
    </select>

    {/* SUMMARY */}
    <p>Subtotal: ₹{subtotal}</p>
    <p>
      Discount (%):
      <input
        type="number"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
      />
    </p>
    <p>GST ({gstRate}%): ₹{gst.toFixed(2)}</p>
    <h2>Total: ₹{grandTotal.toFixed(2)}</h2>

    {/* PAYMENT */}
    <select onChange={(e) => setPaymentMethod(e.target.value)}>
      <option>Cash</option>
      <option>Card</option>
      <option>Pending</option>
    </select>

    <br />
    <button onClick={generateBill}>Generate Invoice</button>

    {showReceipt && (
      <Receipt billData={billData} />
    )}
  </div>
);
  
}

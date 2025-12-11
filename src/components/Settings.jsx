// File: Settings.jsx
import React, { useState } from "react";
import "../styles/Settings.css";

const Settings = () => {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [theme, setTheme] = useState("light");

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      {/* Business Settings */}
      <div className="settings-card">
        <h3>Business Information</h3>
        <div className="settings-row">
          <label>Business Name</label>
          <input
            type="text"
            placeholder="Enter business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="settings-row">
          <label>Business Email</label>
          <input
            type="email"
            placeholder="Enter business email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Settings */}
      <div className="settings-card">
        <h3>Inventory Preferences</h3>

        <div className="settings-row">
          <label>Default Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        <div className="settings-row">
          <label>Low Stock Alert Level</label>
          <input type="number" placeholder="e.g., 10" />
        </div>
      </div>

      {/* Display Settings */}
      <div className="settings-card">
        <h3>Display</h3>

        <div className="settings-row">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <button className="save-btn">Save Settings</button>
    </div>
  );
};

export default Settings;

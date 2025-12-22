import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from "recharts";
import "../styles/MainContent.css";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

const MainContent = () => {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    lowStock: 0,
  });
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [stockStatus, setStockStatus] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/summary")
  .then(res => {
    console.log("RAW RESPONSE:", res);
    console.log("SUMMARY DATA:", res.data);
    setSummary(res.data);
  })
  .catch(err => console.error("SUMMARY ERROR:", err));


    axios.get("http://localhost:5000/api/dashboard/sales-trend")
      .then(res => setSalesTrend(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSalesTrend([]));

    axios.get("http://localhost:5000/api/dashboard/top-products")
      .then(res => setTopProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTopProducts([]));

    axios.get("http://localhost:5000/api/dashboard/stock-status")
      .then(res => setStockStatus(Array.isArray(res.data) ? res.data : []))
      .catch(() => setStockStatus([]));

    axios.get("http://localhost:5000/api/dashboard/payment-breakdown")
      .then(res => setPaymentData(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPaymentData([]));
  }, []);

  return (
    <div className="dashboard">

      {/* KPI CARDS */}
      <div className="grid kpi-grid">
        <Card title="Revenue" value={`₹${summary.totalRevenue}`} />
        <Card title="Sales" value={summary.totalSales} />
        <Card title="Products" value={summary.totalProducts} />
        <Card title="Low Stock" value={summary.lowStock} />
        
      </div>

      {/* SALES TREND */}
      <div className="charts-row">
  <Section title="Sales Trend">
    <ResponsiveContainer width="90%" height={260}>
      <LineChart data={salesTrend}>
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Line dataKey="revenue" stroke="#4f46e5" />
      </LineChart>
    </ResponsiveContainer>
  </Section>

  <Section title="Top Selling Products">
    <ResponsiveContainer width="90%" height={260}>
      <BarChart data={topProducts}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="quantitySold" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  </Section>
</div>


      {/* STOCK + PAYMENT */}
      <div className="grid two-col">

        {/* STOCK STATUS */}
        <Section title="Stock Status">
          <PieChart width={300} height={300}>
            <Pie
              data={stockStatus}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              {stockStatus.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </Section>

        {/* PAYMENT METHODS */}
        <Section title="Payment Methods">
          <PieChart width={300} height={300}>
            <Pie
              data={paymentData}
              dataKey="total"
              nameKey="_id"
              outerRadius={100}
            />
          </PieChart>
        </Section>

      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div
    className="card"
    // style={{
    //   background: "#111",
    //   color: "white",
    //   minHeight: "100px"
    // }}
  >
    <h4>{title}</h4>
    <h2>{String(value)}</h2>
  </div>
);


const Section = ({ title, children }) => (
  <div className="section">
    <h3>{title}</h3>
    {children}
  </div>
);

export default MainContent;

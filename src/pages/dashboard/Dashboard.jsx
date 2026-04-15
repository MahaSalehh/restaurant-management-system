import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

/* ===== DATA ===== */
const stats = [
  { title: "Views", value: "7,265", change: "+11.01%" },
  { title: "Visits", value: "3,671", change: "-0.03%" },
  { title: "New Users", value: "156", change: "+15.03%" },
  { title: "Active Users", value: "2,318", change: "+6.08%" },
];

const lineData = [
  { name: "Jan", uv: 12000, pv: 5000 },
  { name: "Feb", uv: 8000, pv: 14000 },
  { name: "Mar", uv: 15000, pv: 20000 },
  { name: "Apr", uv: 25000, pv: 8000 },
  { name: "May", uv: 28000, pv: 15000 },
  { name: "Jun", uv: 22000, pv: 25000 },
  { name: "Jul", uv: 24000, pv: 30000 },
];

const barData = [
  { name: "Linux", value: 18000 },
  { name: "Mac", value: 30000 },
  { name: "iOS", value: 22000 },
  { name: "Windows", value: 31000 },
  { name: "Android", value: 14000 },
  { name: "Other", value: 26000 },
];

const pieData = [
  { name: "USA", value: 52 },
  { name: "Canada", value: 22 },
  { name: "Mexico", value: 14 },
  { name: "Other", value: 12 },
];

/* ===== COLORS ===== */
const COLORS = ["#6c8cff", "#8dd3c7", "#9bbcff", "#ffd58a"];

function StatCard({ item, index }) {
  const bgColors = ["#e9edfb", "#e7f0f7", "#efeafb", "#e6f1f8"];

  return (
    <div className="stat-card" style={{ background: bgColors[index] }}>
      <p className="stat-title">{item.title}</p>
      <h4 className="stat-value">{item.value}</h4>
      <span className="stat-change">{item.change}</span>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h4>Overview</h4>
        <span>Today</span>
      </div>

      {/* GRID */}
      <div className="dashboard-grid">

        {/* STATS */}
        <div className="stats-row">
          {stats.map((item, i) => (
            <StatCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* LINE CHART */}
        <div className="card-box line-chart">
          <h6>Total Users</h6>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uv" stroke="#111827" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#9bbcff"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="card-box">
          <h6>Traffic by Device</h6>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="card-box">
          <h6>Traffic by Location</h6>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
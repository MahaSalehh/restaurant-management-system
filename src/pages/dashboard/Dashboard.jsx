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

/* DATA */
const stats = [
  { title: "Views", value: "7,265", change: "+11%" },
  { title: "Visits", value: "3,671", change: "-0.03%" },
  { title: "Users", value: "156", change: "+15%" },
  { title: "Active", value: "2,318", change: "+6%" },
];

const lineData = [
  { name: "Jan", uv: 12000, pv: 5000 },
  { name: "Feb", uv: 8000, pv: 14000 },
  { name: "Mar", uv: 15000, pv: 20000 },
  { name: "Apr", uv: 25000, pv: 8000 },
  { name: "May", uv: 28000, pv: 15000 },
];

const barData = [
  { name: "Linux", value: 18000 },
  { name: "Mac", value: 30000 },
  { name: "Windows", value: 31000 },
  { name: "Android", value: 14000 },
];

const pieData = [
  { name: "USA", value: 52 },
  { name: "EU", value: 22 },
  { name: "Asia", value: 14 },
  { name: "Other", value: 12 },
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

/* STAT CARD */
function StatCard({ item }) {
  return (
    <div className="stat">
      <h5>{item.title}</h5>
      <h3>{item.value}</h3>
      <span>{item.change}</span>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dash-page">

      {/* HEADER */}
      <div className="dash-header">
        <h2>Overview</h2>
        <span>Today</span>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <StatCard key={i} item={s} />
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="charts-grid">

        <div className="card large">
          <h4>Users Growth</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line dataKey="uv" stroke="#6366f1" strokeWidth={2} />
              <Line dataKey="pv" stroke="#22c55e" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4>Devices</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4>Locations</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
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
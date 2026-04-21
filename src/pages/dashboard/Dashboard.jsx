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
  { title: "New Users", value: "156", change: "+15%" },
  { title: "Active Users", value: "2,318", change: "+6%" },
];

const lineData = [
  { name: "Jan", thisYear: 12000, lastYear: 5000 },
  { name: "Feb", thisYear: 8000, lastYear: 14000 },
  { name: "Mar", thisYear: 15000, lastYear: 20000 },
  { name: "Apr", thisYear: 25000, lastYear: 8000 },
  { name: "May", thisYear: 28000, lastYear: 15000 },
  { name: "Jun", thisYear: 22000, lastYear: 23000 },
  { name: "Jul", thisYear: 24000, lastYear: 30000 },
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

const COLORS = ["#6366f1", "#22c55e", "#94a3b8", "#e5e7eb"];

/* STAT CARD */
function StatCard({ item }) {
  return (
    <div className="stat modern">
      <p>{item.title}</p>
      <h2>{item.value}</h2>
      <span className="change">{item.change}</span>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dash-page modern">

      {/* HEADER */}
      <div className="dash-header modern">
        <h2>Overview</h2>
        <span>Today</span>
      </div>

      {/* STATS */}
      <div className="stats-grid modern">
        {stats.map((s, i) => (
          <StatCard key={i} item={s} />
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="charts-layout">

        {/* LEFT */}
        <div className="left">

          {/* LINE CHART */}
          <div className="card big">
            <div className="card-header">
              <h4>Total Users</h4>
              <div className="legend">
                <span className="dot black"></span> This Year
                <span className="dot dashed"></span> Last Year
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="thisYear"
                  stroke="#111"
                  strokeWidth={2}
                />
                <Line
                  dataKey="lastYear"
                  stroke="#6366f1"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BOTTOM GRID */}
          <div className="bottom-grid">

            <div className="card">
              <h4>Traffic by Device</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h4>Traffic by Location</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="right">

          <div className="card">
            <h4>Traffic by Website</h4>
            <ul className="traffic-list">
              <li>Google <span>•••</span></li>
              <li>YouTube <span>•••</span></li>
              <li>Instagram <span>•••</span></li>
              <li>Pinterest <span>•••</span></li>
              <li>Facebook <span>•••</span></li>
              <li>Twitter <span>•••</span></li>
            </ul>
          </div>

          <div className="card">
            <h4>Activities</h4>
            <ul className="activity-list">
              <li>Changed the style</li>
              <li>Released a new version</li>
              <li>Submitted a bug</li>
              <li>Modified data</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
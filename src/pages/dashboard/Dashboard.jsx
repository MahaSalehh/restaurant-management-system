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


import { useCallback } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import {
  FaUsers, FaShoppingCart, FaCalendarAlt, FaUtensils,
} from "react-icons/fa";
import { adminAPI, publicAPI } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useToastError } from "../../hooks/useToastsError";

function StatsCard({ icon, label, value, color, loading }) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body className="d-flex align-items-center gap-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 56, height: 56, backgroundColor: `${color}20`, color, fontSize: 22 }}
        >
          {icon}
        </div>
        <div>
          <p className="text-muted mb-0 small">{label}</p>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <h4 className="fw-bold mb-0">{value ?? "—"}</h4>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}



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



export default function Dashboard() {
  const fetchUsers    = useCallback(() => adminAPI.getUsers(), []);
  const fetchOrders   = useCallback(() => adminAPI.getAllOrders(), []);
  const fetchBookings = useCallback(() => adminAPI.getAllBookings(), []);
  const fetchItems    = useCallback(() => publicAPI.getMenuItems(), []);

  const { data: usersData,    loading: ul, error: ue } = useAsync(fetchUsers);
  const { data: ordersData,   loading: ol, error: oe } = useAsync(fetchOrders);
  const { data: bookingsData, loading: bl, error: be } = useAsync(fetchBookings);
  const { data: itemsData,    loading: il, error: ie } = useAsync(fetchItems);

  useToastError(ue);
  useToastError(oe);
  useToastError(be);
  useToastError(ie);

  const count = (data) => {
    const list = data?.data ?? data ?? [];
    return Array.isArray(list) ? list.length : (data?.total ?? "—");
  };

  const stats = [
    { icon: <FaUsers />,       label: "Total Users",    value: count(usersData),    loading: ul, color: "#0d6efd" },
    { icon: <FaShoppingCart />, label: "Total Orders",  value: count(ordersData),   loading: ol, color: "#198754" },
    { icon: <FaCalendarAlt />, label: "Total Bookings", value: count(bookingsData), loading: bl, color: "#ffc107" },
    { icon: <FaUtensils />,    label: "Menu Items",     value: count(itemsData),    loading: il, color: "#dc3545" },
  ];

  
  return (
    <div className="dash-page modern">
    <Container fluid className="py-3">
      <h2 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>Overview</h2>
      <p className="text-muted mb-4">Welcome back! Here's what's happening today.</p>

      <Row className="g-4">
        {stats.map((s) => (
          <Col key={s.label} xl={3} md={6}>
            <StatsCard {...s} />
          </Col>
        ))}
      </Row>
    </Container>



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

            <div className="card-app">
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

            <div className="card-app">
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

          <div className="card-app">
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

          <div className="card-app">
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
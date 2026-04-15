import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Image,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { FaShoppingBag, FaCalendarAlt, FaUser, FaEdit } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { settingsAPI } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

import UserOrders from "../../components/MyOrders";
import UserBookings from "../../components/MyBookings";

function Profile() {
  const { user, setUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  // ================= UPDATE PROFILE =================
  const {
    loading: updateLoading,
    execute: updateProfile,
  } = useAsync(settingsAPI.updateProfile, [], false);

  // ================= SYNC FORM =================
  useEffect(() => {
    if (showEdit) {
      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
      });
    }
  }, [showEdit, user]);

  // ================= UPDATE HANDLER =================
 const handleUpdate = async () => {
  if (!formData.name || !formData.phone) {
    showToast("error", "Name and phone are required");
    return;
  }

  try {
    const res = await updateProfile(formData);

    const updatedUser =
      res?.data?.data ||
      res?.data?.user ||
      res?.data;

    setUser(updatedUser);

    showToast("success", "Profile updated successfully 🎉");

    setShowEdit(false);
  } catch (err) {
    showToast(
      "error",
      err.response?.data?.message || "Failed to update profile"
    );
  }
};

  return (
    <div className="profile-wrapper">

      <Container fluid>
        <Row>

          {/* SIDEBAR */}
          <Col md={3} className="sidebar">

            <div className="sidebar-header">
              <Image
                src={`https://ui-avatars.com/api/?name=${user?.name}`}
                roundedCircle
                width={70}
              />

              <div>
                <h6>{user?.name}</h6>
                <span>{user?.email}</span>
              </div>
            </div>

            <Nav className="flex-column sidebar-nav">

              <Nav.Link
                className={activeTab === "profile" ? "active" : ""}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser /> Profile
              </Nav.Link>

              <Nav.Link
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                <FaShoppingBag /> Orders
              </Nav.Link>

              <Nav.Link
                className={activeTab === "bookings" ? "active" : ""}
                onClick={() => setActiveTab("bookings")}
              >
                <FaCalendarAlt /> Bookings
              </Nav.Link>

              <Button
                onClick={() => logout(navigate)}
                size="sm"
                className="edit-btn"
              >
                Logout
              </Button>

            </Nav>
          </Col>

          {/* CONTENT */}
          <Col md={9} className="content">

            {/* PROFILE CARD */}
            <div className="profile-card">

              <div className="profile-info">
                <Image
                  src={`https://ui-avatars.com/api/?name=${user?.name}`}
                  roundedCircle
                  width={80}
                />

                <div>
                  <h5>{user?.name}</h5>
                  <p>{user?.email}</p>
                </div>
              </div>

              <Button
                className="edit-btn"
                onClick={() => setShowEdit(true)}
              >
                <FaEdit /> Edit
              </Button>

            </div>

            {/* CONTENT AREA */}
            <div className="card-section">

              {activeTab === "orders" && <UserOrders />}
              {activeTab === "bookings" && <UserBookings />}

              {activeTab === "profile" && (
                <div className="info-card">
                  <h6>Personal Information</h6>

                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Phone:</strong> {user?.phone}</p>

                </div>
              )}

            </div>

          </Col>

        </Row>
      </Container>

      {/* ================= EDIT MODAL ================= */}
      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        centered
      >

        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>

              <Form.Control
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

            </Form.Group>

            <Form.Group>
              <Form.Label>Phone</Form.Label>

              <Form.Control
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="light"
            onClick={() => setShowEdit(false)}
          >
            Cancel
          </Button>

          <Button
            className="save-btn"
            onClick={handleUpdate}
            disabled={updateLoading}
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
}

export default Profile;
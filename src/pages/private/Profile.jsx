import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

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

  const [activeTab, setActiveTab] = useState("profile");
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const { loading: updateLoading, execute: updateProfile } =
    useAsync(settingsAPI.updateProfile, [], false);

  // sync form
  useEffect(() => {
    if (showEdit) {
      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
      });
    }
  }, [showEdit, user]);

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (formData.name.length < 3) {
      showToast("error", "Name must be at least 3 characters");
      return;
    }

    if (formData.phone.length !== 11) {
      showToast("error", "Phone must be 11 digits");
      return;
    }

    try {
      const res = await updateProfile(formData);

      const updatedUser =
        res?.data?.data || res?.data?.user || res?.data || formData;

      // force rerender
      setUser({ ...user, ...updatedUser, ...formData });

      showToast("success", "Profile updated successfully 🎉");

      setShowEdit(false);
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Update failed"
      );
    }
  };

  const avatar = `https://ui-avatars.com/api/?name=${user?.name}&background=random&size=128`;

  if (!user) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* ================= CARD ================= */}
        <div className="profile-card">

          <div className="profile-info">
            <img src={avatar} className="avatar" alt="user" />

            <div>
              <h5>{user?.name}</h5>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button className="edit-btn" onClick={() => setShowEdit(true)}>
              <FaEdit /> Edit
            </button>

            <button
              className="logout-btn"
              onClick={() => logout(navigate)}
            >
              Logout
            </button>
          </div>

        </div>

        {/* ================= TABS ================= */}
        <div className="profile-tabs">

          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>

          <button
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>

        </div>

        {/* ================= CONTENT ================= */}
        <div className="profile-content">

          {activeTab === "profile" && (
            <div className="info-card">
              <h6>Personal Information</h6>

              <p><b>Name:</b> {user?.name}</p>
              <p><b>Email:</b> {user?.email}</p>
              <p><b>Phone:</b> {user?.phone || "Not set"}</p>
            </div>
          )}

          {activeTab === "orders" && <UserOrders />}
          {activeTab === "bookings" && <UserBookings />}

        </div>

        {/* ================= MODAL ================= */}
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

            <Button variant="secondary" onClick={() => setShowEdit(false)}>
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
    </div>
  );
}

export default Profile;
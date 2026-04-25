import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { settingsAPI } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

import UserOrders from "./MyOrders";
import UserBookings from "./MyBookings";
import Loader from "../../components/Loader";

function Profile() {
  const { user, updateUser, refreshUser, logout } = useAuth();
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

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleUpdate = async () => {
    if (formData.name.length < 3) {
      showToast("error", "Name must be at least 3 characters");
      return;
    }

    if (!/^01\d{9}$/.test(formData.phone) ) {
      showToast("error", "Phone must start with 01 and be 11 digits");
      return;
    }

    try {
      const res = await updateProfile(formData);

      const updatedUser =
        res?.data?.user ||
        res?.data?.data?.user ||
        res?.data;

      if (!updatedUser) {
        throw new Error("Invalid response from server");
      }

      updateUser(updatedUser);
      await refreshUser();

      setShowEdit(false);
      showToast("success", "Profile updated successfully");
    } catch (err) {
      showToast(
    "error",
    err?.response?.data?.message ||
    err?.response?.data?.errors?.phone?.[0] ||
    "Update failed"
  );
    }
  };

  const avatar = `https://ui-avatars.com/api/?name=${user?.name}&background=random&size=128`;

  if (!user) return <Loader />;

  return (
    <div className="profile-page">
      <div className="profile-container">

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

        {user?.role !== "admin" && (
  <div className="profile-tabs">

    <button
      className={activeTab === "profile" ? "active" : ""}
      onClick={() => setActiveTab("profile")}
    >
      <span>Profile</span>
    </button>

    <button
      className={activeTab === "orders" ? "active" : ""}
      onClick={() => setActiveTab("orders")}
    >
      <span>Orders</span>
    </button>

    <button
      className={activeTab === "bookings" ? "active" : ""}
      onClick={() => setActiveTab("bookings")}
    >
      <span>Bookings</span>
    </button>

  </div>
)}

        <div className="profile-content">

  {user?.role === "admin" ? (
    <div className="info-card">
      <h6>Admin Profile</h6>

      <p><b>Name:</b> {user?.name}</p>
      <p><b>Email:</b> {user?.email}</p>
      <p><b>Role:</b> Admin</p>
    </div>
  ) : (
    <>
      {activeTab === "profile" && (
        <div className="info-card">
          <h6>Personal Information</h6>
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
          <p><b>Phone:</b> {user?.phone}</p>
        </div>
      )}

      {activeTab === "orders" && <UserOrders />}
      {activeTab === "bookings" && <UserBookings />}
    </>
  )}

</div>

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
                  minLength={3}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Phone</Form.Label>

                <Form.Control
                  maxLength={11}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </Form.Group>

            </Form>

          </Modal.Body>

          <Modal.Footer>

            <button
            className="btn-custom btn-outline-custom btn-sm"
            variant="secondary" onClick={() => setShowEdit(false)}>
              Cancel
            </button>

            <button
              className="btn-custom btn-primary-custom btn-sm save-btn"
              onClick={handleUpdate}
              disabled={updateLoading}
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>

          </Modal.Footer>

        </Modal>

      </div>
    </div>
  );
}

export default Profile;
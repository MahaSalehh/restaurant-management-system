import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Image,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaEdit } from "react-icons/fa";
import { settingsAPI } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useAsync } from "../../hooks/useAsync";

function AdminProfile() {
  const { user, updateUser, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [show, setShow] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const { loading: updateLoading, execute: updateProfile } =
    useAsync(settingsAPI.updateProfile, [], false);

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
        res?.data?.user ||
        res?.data?.data?.user ||
        res?.data;

      if (!updatedUser) {
        throw new Error("Invalid response from server");
      }

      updateUser(updatedUser);
      await refreshUser();

      setShow(false); // ✅ close modal
      showToast("success", "Profile updated successfully");

    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message ||
          err.message ||
          "Update failed"
      );
    }
  };

  return (
    <Container className="admin-profile py-4 m-0">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="align-items-center">

                <Col md={4} className="text-center mb-3 mb-md-0">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=8ba6e9&color=fff&size=128`}
                    roundedCircle
                  />
                </Col>

                <Col md={8}>
                  <h3 className="mb-2">{user?.name}</h3>

                  <p className="text-muted mb-1">
                    <strong>Email:</strong> {user?.email}
                  </p>

                  <p className="text-muted mb-3">
                    <strong>Role:</strong> {user?.role || "User"}
                  </p>

                  <div className="d-flex gap-2">

                    <Button variant="primary" onClick={() => setShow(true)}>
                      <FaEdit className="me-1" /> Edit Profile
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => logout(navigate)}
                    >
                      <FaSignOutAlt className="me-1" /> Logout
                    </Button>

                  </div>
                </Col>

              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)} centered
          dialogClassName="admin-modal"
  backdropClassName="admin-modal-backdrop">
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
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
            onClick={() => setShow(false)}
            disabled={updateLoading}
          >
            Cancel
          </button>

          <button
            className="btn-custom btn-primary-custom btn-sm"
            onClick={handleUpdate}
            disabled={updateLoading}
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </button>

        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default AdminProfile;
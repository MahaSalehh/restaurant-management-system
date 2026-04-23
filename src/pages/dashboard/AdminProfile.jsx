import { useState } from "react";
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
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [show, setShow] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const {
  execute: updateProfile,
  loading: updating,
} = useAsync(settingsAPI.updateProfile, [], {
  onSuccess: (data) => {
    setUser(data);
    showToast("success", "Profile updated successfully");
    setShow(false);
  },
  onError: () => {
    showToast("error", "Failed to update profile");
  },
});

  const handleUpdate = () => {
    updateProfile(formData);
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

                    {/* Edit */}
                    <Button variant="primary" onClick={() => setShow(true)}>
                      <FaEdit className="me-1" /> Edit Profile
                    </Button>

                    {/* Logout */}
                    <Button variant="danger" onClick={() => logout(navigate)}>
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
      <Modal show={show} onHide={() => setShow(false)} centered>
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
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShow(false)}
            disabled={updating}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>

        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default AdminProfile;
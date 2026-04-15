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
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaEdit } from "react-icons/fa";
import { settingsAPI } from "../../service/api";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await settingsAPI.updateProfile(formData);
      setShow(false);
      window.location.reload(); // refresh data (simple solution)
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-1 my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="align-items-center">
                {/* Avatar */}
                <Col md={4} className="text-center mb-3 mb-md-0">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=8ba6e9&color=fff&size=128`}
                    roundedCircle
                  />
                </Col>

                {/* Info */}
                <Col md={8}>
                  <h3 className="mb-2">{user?.name}</h3>

                  <p className="text-muted mb-1">
                    <strong>Email:</strong> {user?.email}
                  </p>

                  <p className="text-muted mb-3">
                    <strong>Role:</strong> {user?.role || "User"}
                  </p>

                  <div className="d-flex gap-2">
                    {/* Edit Button */}
                    <Button variant="primary" onClick={() => setShow(true)}>
                      <FaEdit className="me-1" /> Edit Profile
                    </Button>

                    {/* Logout */}
                    <Button variant="danger" onClick={()=> logout(navigate)}>
                      <FaSignOutAlt className="me-1" /> Logout
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ✅ Modal */}
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminProfile;
import { useState, useCallback } from "react";
import {
  Container, Row, Col, Table, Badge, Button, InputGroup, Form, Spinner, Modal,
} from "react-bootstrap";
import { FaSearch, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { adminAPI } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useToastError } from "../../hooks/useToastsError";
import { useToast } from "../../context/ToastContext";

function Users() {
  const [search, setSearch] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const { showToast } = useToast();

  const fetchUsers = useCallback(() => adminAPI.getUsers(), []);
  const { data, loading, error, execute: refetch } = useAsync(fetchUsers);
  useToastError(error);

  const users = data?.data ?? data ?? [];
  const filtered = users.filter(u =>
    `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await adminAPI.deleteUser(id);
      showToast("success", "User deleted");
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete user");
    }
  }

  async function handleRestore(id) {
    try {
      await adminAPI.restoreUser(id);
      showToast("success", "User restored");
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to restore user");
    }
  }

  async function handleRoleSubmit() {
    try {
      await adminAPI.updateUserRole(selectedUser.id, { role: newRole });
      showToast("success", "Role updated");
      setShowRoleModal(false);
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update role");
    }
  }

  return (
    <Container fluid className="py-3">
      <h2 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>Users</h2>
      <p className="text-muted mb-4">Manage user accounts and roles</p>

      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <InputGroup.Text><FaSearch /></InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /><p>Loading users...</p></div>
      ) : (
        <Table responsive hover bordered className="align-middle">
          <thead className="table-dark">
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><Badge bg="info">{u.role}</Badge></td>
                <td>
                  <Badge bg={u.deleted_at ? "danger" : "success"}>
                    {u.deleted_at ? "Deleted" : "Active"}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-primary"
                      onClick={() => { setSelectedUser(u); setNewRole(u.role); setShowRoleModal(true); }}>
                      <FaEdit /> Role
                    </Button>
                    {u.deleted_at ? (
                      <Button size="sm" variant="outline-success" onClick={() => handleRestore(u.id)}>
                        <FaUndo /> Restore
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(u.id)}>
                        <FaTrash />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Role — {selectedUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select value={newRole} onChange={e => setNewRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleRoleSubmit}>Update</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Users;
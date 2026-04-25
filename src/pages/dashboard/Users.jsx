import { useState, useCallback } from "react";
import {
  Container, Row, Col, Table, Badge, Button,
  InputGroup, Form, Spinner, Modal, OverlayTrigger, Tooltip
} from "react-bootstrap";
import { FaSearch, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { adminAPI } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useToastError } from "../../hooks/useToastsError";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

function Users() {
  const { user: currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const { showToast } = useToast();

  const fetchUsers = useCallback(() => adminAPI.getUsers(), []);
  const { data, loading, error, execute: refetch } = useAsync(fetchUsers);
  useToastError(error);

  const USER_STATUS = ["user", "admin"];

  const users = (data?.data ?? data ?? [])
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filtered = users
    .filter(u =>
      String(u.id).includes(search) ||
      `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )
    .filter(u => {
      const roleMatch =
        userFilter === "all" ? true : u.role === userFilter;

      const statusMatch =
        statusFilter === "all"
          ? true
          : u.status === statusFilter;

      return roleMatch && statusMatch;
    })

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
      <h2 className="fw-bold mb-1">Users</h2>
      <p className="text-muted mb-4">Manage user accounts and roles</p>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button
          size="sm"
          variant={userFilter === "all" ? "primary" : "outline-secondary"}
          onClick={() => setUserFilter("all")}
        >
          All
        </Button>

        {USER_STATUS.map(role => (
          <Button
            key={role}
            size="sm"
            variant={userFilter === role ? "primary" : "outline-secondary"}
            onClick={() => setUserFilter(role)}
            className="text-capitalize"
          >
            {role}
          </Button>
        ))}
        <Button
          size="sm"
          variant={statusFilter === "active" ? "success" : "outline-success"}
          onClick={() =>
            setStatusFilter(statusFilter === "active" ? "all" : "active")
          }
        >
          Active
        </Button>

        <Button
          size="sm"
          variant={statusFilter === "deleted" ? "danger" : "outline-danger"}
          onClick={() =>
            setStatusFilter(statusFilter === "deleted" ? "all" : "deleted")
          }
        >
          Deleted
        </Button>

      </div>

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
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p>Loading users...</p>
        </div>
      ) : (
        <Table responsive hover bordered className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => {
              const isMe = currentUser?.id === u.id;

              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>

                  <td>
                    <Badge bg={u.role === "admin" ? "dark" : "primary"}>
                      {u.role}
                    </Badge>
                  </td>

                  <td>
                    <Badge bg={u.status === "deleted" ? "danger" : "success"}>
                      {u.status === "deleted" ? "Deleted" : "Active"}
                    </Badge>
                  </td>

                  <td>
                    <div className="d-flex gap-2">

                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>
                            {isMe ? "You can't edit your own role" : "Edit role"}
                          </Tooltip>
                        }
                      >
                        <span className="d-inline-block">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            disabled={isMe}
                            onClick={() => {
                              setSelectedUser(u);
                              setNewRole(u.role);
                              setShowRoleModal(true);
                            }}
                          >
                            <FaEdit />
                          </Button>
                        </span>
                      </OverlayTrigger>

                      {u.status === "deleted" ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Restore user</Tooltip>}
                        >
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => handleRestore(u.id)}
                          >
                            <FaUndo />
                          </Button>
                        </OverlayTrigger>
                      ) : (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              {isMe ? "You can't delete yourself" : "Delete user"}
                            </Tooltip>
                          }
                        >
                          <span className="d-inline-block">
                            <Button
                              size="sm"
                              variant="outline-danger"
                              disabled={isMe}
                              onClick={() => handleDelete(u.id)}
                            >
                              <FaTrash />
                            </Button>
                          </span>
                        </OverlayTrigger>
                      )}

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Update Role — {selectedUser?.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Select
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleRoleSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Users;
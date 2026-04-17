import { useEffect, useState } from "react";
import { adminAPI } from "../../service/api";

import DataTable from "./components/DataTable";
import Modal from "./components/Modal";
import ActionButtons from "./components/ActionButtons";

function Users() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= RESTORE =================
  const handleRestore = async (id) => {
    try {
      await adminAPI.restoreUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTER =================
  const filteredUsers =
    activeTab === "all"
      ? users
      : users.filter((u) => u.status === activeTab);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users</h1>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="d-flex gap-2 mb-3 flex-wrap">

        <button
          className={`btn px-3 py-1 fw-medium ${
            activeTab === "all" ? "btn-dark" : "btn-light border"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Users
        </button>

        <button
          className={`btn px-3 py-1 fw-medium ${
            activeTab === "active" ? "btn-dark" : "btn-light border"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Users
        </button>

        <button
          className={`btn px-3 py-1 fw-medium ${
            activeTab === "deleted" ? "btn-dark" : "btn-light border"
          }`}
          onClick={() => setActiveTab("deleted")}
        >
          Deleted Users
        </button>

      </div>

      {/* ================= TABLE ================= */}
      <DataTable columns={["ID", "Name", "Email", "Role", "Status", "Actions"]}>
        {filteredUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>

            <td style={{ textTransform: "capitalize" }}>
              {user.role}
            </td>

            {/* STATUS (UNCHANGED LOGIC) */}
            <td>
              {user.status === "deleted" ? (
                <span style={{ color: "red" }}>Deleted</span>
              ) : (
                <span style={{ color: "green" }}>Active</span>
              )}
            </td>

            {/* ACTIONS (STYLED ONLY) */}
            <td>
              <div className="d-flex gap-2 flex-wrap">

                <ActionButtons
  actions={[
    {
      label: "View",
      variant: "primary",
      onClick: () => {
        setSelectedUser(user);
        setShowModal(true);
      },
    },
    user.status === "deleted"
      ? {
          label: "Restore",
          variant: "success",
          onClick: () => handleRestore(user.id),
        }
      : {
          label: "Delete",
          variant: "danger",
          onClick: () => handleDelete(user.id),
        },
  ]}
/>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* ================= MODAL ================= */}
      {showModal && selectedUser && (
        <Modal
          open={showModal}
          title="User Details"
          onClose={() => setShowModal(false)}
        >
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>

          {selectedUser.deleted_at && (
            <p style={{ color: "red" }}>
              Deleted At: {selectedUser.deleted_at}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}

export default Users;
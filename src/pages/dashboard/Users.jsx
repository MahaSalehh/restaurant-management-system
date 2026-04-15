import { useEffect, useState } from "react";
import { adminAPI } from "../../service/api";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // ================= FILTER USERS =================
  const filteredUsers =
  activeTab === "all"
    ? users
    : users.filter((u) => u.status === activeTab);
  return (
    <div style={{ padding: "20px" }}>
      <h1>Users</h1>

      {/* ================= TABS ================= */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "8px 16px",
            background: activeTab === "all" ? "black" : "#ddd",
            color: activeTab === "all" ? "white" : "black",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          All Users
        </button>

        <button
          onClick={() => setActiveTab("active")}
          style={{
            padding: "8px 16px",
            background: activeTab === "active" ? "black" : "#ddd",
            color: activeTab === "active" ? "white" : "black",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Active Users
        </button>
        <button
          onClick={() => setActiveTab("deleted")}
          style={{
            padding: "8px 16px",
            background: activeTab === "deleted" ? "black" : "#ddd",
            color: activeTab === "deleted" ? "white" : "black",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Deleted Users
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
  {filteredUsers.map((user) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td style={{ textTransform: "capitalize" }}>
        {user.role}
      </td>

      {/* Status */}
      <td>
        {user.status === "deleted" ? (
          <span style={{ color: "red" }}>Deleted</span>
        ) : (
          <span style={{ color: "green" }}>Active</span>
        )}
      </td>

      {/* Actions */}
      <td style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => {
            setSelectedUser(user);
            setShowModal(true);
          }}
        >
          View
        </button>

        {user.status === "deleted" ? (
          <button onClick={() => handleRestore(user.id)}>
            Restore
          </button>
        ) : (
          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>
      </table>

      {/* ================= MODAL ================= */}
      {showModal && selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3>User Details</h3>

            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>

            {selectedUser.deleted_at && (
              <p style={{ color: "red" }}>
                Deleted At: {selectedUser.deleted_at}
              </p>
            )}

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                background: "red",
                color: "white",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
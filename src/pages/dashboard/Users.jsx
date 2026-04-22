import { useState } from "react";
import { adminAPI } from "../../service/api";

import CrudCard from "./components/Card";
import CrudModal from "./components/Modal";
import { useCrudPage } from "./hooks/useCrudPage";

function Users() {

  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: users = [],
    loading,
    formData,
    setFormData,
    showModal,
    setShowModal,
    openEdit,
    remove,
  } = useCrudPage({
    getAll: adminAPI.getUsers,
    create: async () => {},
    update: async () => {},
    delete: adminAPI.deleteUser,
  });

  const handleRestore = async (id) => {
    await adminAPI.restoreUser(id);
  };

  // FILTER
  const filteredUsers =
    activeTab === "all"
      ? users
      : users.filter((u) => u.status === activeTab);

  const fields = [
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "role", label: "Role" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminAPI.updateUser(formData.id, formData);
    setShowModal(false);
  };

  return (
    <div className="container py-3">

      <h3 className="mb-3">Users</h3>

      {/* FILTER */}
      <div className="d-flex gap-2 mb-3 flex-wrap">

        <button
          className={`btn ${activeTab === "all" ? "btn-dark" : "btn-light"}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>

        <button
          className={`btn ${activeTab === "active" ? "btn-dark" : "btn-light"}`}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>

        <button
          className={`btn ${activeTab === "deleted" ? "btn-dark" : "btn-light"}`}
          onClick={() => setActiveTab("deleted")}
        >
          Deleted
        </button>

      </div>

      {/* GRID */}
      <div className="row g-3">

        {(filteredUsers || []).map((user) => (
          <div className="col-md-4" key={user.id}>

            <CrudCard
              title={user.name}
              subtitle={user.email}
              extra={`Role: ${user.role}`}
              status={user.status}
              onView={() => setSelectedUser(user)}
              onEdit={() => openEdit(user)}
              onDelete={() => remove(user.id)}
              onRestore={
                user.status === "deleted"
                  ? () => handleRestore(user.id)
                  : null
              }
            />

          </div>
        ))}

      </div>

      {/* MODAL (view/edit) */}
      <CrudModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Edit User"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        fields={fields}
      />

      {/* VIEW MODAL */}
      {selectedUser && (
        <CrudModal
          show={!!selectedUser}
          onHide={() => setSelectedUser(null)}
          title="User Details"
          readOnly
          formData={selectedUser}
          fields={fields}
        />
      )}

    </div>
  );
}

export default Users;
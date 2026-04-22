import { api } from "../../service/api";

import PageLayout from "./components/PageLayout";
import { useCrudPage } from "./hooks/useCrudPage";

function Messages() {

  // ================= CRUD HOOK =================
  const {
    data: messages = [],
    loading,
    remove,
  } = useCrudPage({
    getAll: () => api.get("/admin/contacts"),
    create: async () => {},
    update: async () => {},
    delete: (id) => api.delete(`/admin/contacts/${id}`),
  });

  // ================= UI =================
  return (
    <PageLayout title="Contact Messages">

      <div className="card p-3">

        <table className="table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {(messages || []).map((msg) => (
              <tr key={msg.id}>

                <td>{msg.name}</td>
                <td>{msg.email}</td>

                <td style={{ maxWidth: "300px" }}>
                  {msg.message?.length > 80
                    ? msg.message.slice(0, 80) + "..."
                    : msg.message}
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => remove(msg.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </PageLayout>
  );
}

export default Messages;
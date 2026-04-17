import { useEffect, useState } from "react";
import { api } from "../../service/api";

import PageLayout from "./components/PageLayout";
import DataTable from "./components/DataTable";
import ActionButtons from "./components/ActionButtons";

function Messages() {
  const [messages, setMessages] = useState([]);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await api.get("/admin/contacts");
      setMessages(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete message?")) return;

    try {
      await api.delete(`/admin/contacts/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <PageLayout title="Contact Messages">

      <DataTable columns={["Name", "Email", "Message", "Actions"]}>
        {(messages || []).map((msg) => (
          <tr key={msg.id}>
            <td>{msg.name}</td>
            <td>{msg.email}</td>

            <td style={{ maxWidth: "300px" }}>
              <span>
                {msg.message?.length > 80
                  ? msg.message.slice(0, 80) + "..."
                  : msg.message}
              </span>
            </td>

            <td>
              <ActionButtons
                onDelete={() => handleDelete(msg.id)}
              />
            </td>
          </tr>
        ))}
      </DataTable>

    </PageLayout>
  );
}

export default Messages;
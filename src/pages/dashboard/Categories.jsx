import { useEffect, useState } from "react";
import { adminAPI, publicAPI } from "../../service/api";

import PageLayout from "./components/PageLayout";
import DataTable from "./components/DataTable";
import ActionButtons from "./components/ActionButtons";
import FormField from "./components/FormField";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await publicAPI.getCategories();
      setCategories(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await adminAPI.updateCategory(editingId, { name });
      } else {
        await adminAPI.createCategory({ name });
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await adminAPI.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  // ================= UI =================
  return (
    <PageLayout title="Categories">

      {/* FORM */}
      <form onSubmit={handleSubmit} className="card p-3">

        <FormField
          label="Category Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="btn btn-dark">
          {editingId ? "Update" : "Create"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <DataTable columns={["ID", "Name", "Actions"]}>
        {(categories || []).map((cat) => (
          <tr key={cat.id}>
            <td>{cat.id}</td>
            <td>{cat.name}</td>

            <td>
              <ActionButtons
  actions={[
    {
      label: "delete",
      variant: "danger",
      onClick: () => {
        handleDelete(cat.id);
      }},
      {
      label: "edit",
      varient: "light",
      onClick: () => {
        handleEdit(cat)
      }
      }
    ]}
/>
            </td>
          </tr>
        ))}
      </DataTable>

    </PageLayout>
  );
}
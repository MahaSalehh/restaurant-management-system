import { useEffect, useState } from "react";
import { adminAPI, publicAPI } from "../../service/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ==========================
  // GET DATA
  // ==========================
  
  const fetchCategories = async () => {
    try {
      const res = await publicAPI.getCategories();
      setCategories(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================
  // CREATE / UPDATE
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await adminAPI.updateCategory(editingId, { name });
      } else {
        await adminAPI.createCategory({ name });
      }

      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // EDIT
  // ==========================
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
  };

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await adminAPI.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // UI
  // ==========================
  return (
    <div className="container mt-4">
      <h2>Manage Categories</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control mb-2"
        />

        <button className="btn btn-primary">
          {editingId ? "Update" : "Create"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setName("");
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
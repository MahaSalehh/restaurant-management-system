import { useEffect, useState } from "react";
import { adminAPI, publicAPI, STORAGE_URL } from "../../service/api";
function MenuItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: null,
  });

  const [editingId, setEditingId] = useState(null);

  // ==========================
  // GET DATA
  // ==========================
  const fetchData = async () => {
  try {
    const res = await publicAPI.getMenuItems();
    setItems(res.data.data || res.data);

    const catRes = await publicAPI.getCategories();
    setCategories(catRes.data.data || catRes.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // ==========================
  // HANDLE INPUT
  // ==========================
  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "image_url") {
    setForm({ ...form, image_url: files[0] }); // ✅ file
  } else {
    setForm({ ...form, [name]: value });
  }
};

  // ==========================
  // CREATE / UPDATE
  // ==========================

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    if (editingId) {
      await adminAPI.updateMenuItem(editingId, formData);
    } else {
      await adminAPI.createMenuItem(formData);
    }
console.log(form.image_url);
    resetForm();
    fetchData();
  } catch (err) {
    console.error(err.response?.data || err);
  }
};


  // ==========================
  // EDIT
  // ==========================
  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      image_url: null,
    });

    setEditingId(item.id);
  };

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await adminAPI.deleteMenuItem(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // RESET
  // ==========================
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category_id: "",
      image_url: null,
    });
    setEditingId(null);
  };

  // ==========================
  // UI
  // ==========================
  return (
    <div className="container mt-4">
      <h2>Manage Menu Items</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          name="image_url"
          accept="image/*"
          onChange={handleChange}
          className="form-control mb-2"
        />

        <button className="btn btn-primary">
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
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                {item.image_url && (
                  <img
                    src={STORAGE_URL + item.image_url}
                    alt=""
                    width="60"
                  />
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>{item.category?.name}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
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
export default MenuItems;
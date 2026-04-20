import { useEffect, useState } from "react";
import { adminAPI, publicAPI, STORAGE_URL } from "../../service/api";

import PageLayout from "./components/PageLayout";
import DataTable from "./components/DataTable";
import ActionButtons from "./components/ActionButtons";
import FormField from "./components/FormField";

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

  // ================= FETCH =================
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
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image_url") {
      setForm({ ...form, image_url: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================= SUBMIT =================
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

      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
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

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await adminAPI.deleteMenuItem(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= RESET =================
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

  // ================= UI =================
  return (
    <PageLayout title="Menu Items">

      {/* FORM */}
      <form onSubmit={handleSubmit} className="card p-3">

        <FormField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <FormField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <FormField
          label="Price"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
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
          onChange={handleChange}
          className="form-control mb-2"
        />

        <button className="btn btn-dark">
          {editingId ? "Update" : "Create"}
        </button>

      </form>

      {/* TABLE */}
      <DataTable
        columns={["Image", "Name", "Description", "Price", "Category", "Actions"]}
      >
        {(items || []).map((item) => (
          <tr key={item.id}>
            <td>
              {item.image_url && (
                <img
                  src={STORAGE_URL + item.image_url}
                  width="50"
                  alt=""
                />
              )}
            </td>

            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{item.price}</td>
            <td>{item.category?.name}</td>

            <td>
              <ActionButtons
                actions={[
                  {
                    label: "delete",
                    variant: "danger",
                    onClick: () => {
                      handleDelete(item.id);
                    }},
                    {
                    label: "edit",
                    varient: "light",
                    onClick: () => {
                      handleEdit(item)
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

export default MenuItems;
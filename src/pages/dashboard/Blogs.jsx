import { useEffect, useState } from "react";
import { adminAPI, publicAPI } from "../../service/api";

import PageLayout from "./components/PageLayout";
import DataTable from "./components/DataTable";
import ActionButtons from "./components/ActionButtons";
import FormField from "./components/FormField";

function Blogs() {
  const [articles, setArticles] = useState([]);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: null,
  });

  const [editingId, setEditingId] = useState(null);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await publicAPI.getArticles();
      setArticles(res.data.data || res.data || []);
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
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      if (editingId) {
        await adminAPI.updateArticle(editingId, formData);
      } else {
        await adminAPI.createArticle(formData);
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setForm({
      title: item.title,
      content: item.content,
      image_url: null,
    });

    setEditingId(item.id);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await adminAPI.deleteArticle(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      image_url: null,
    });
    setEditingId(null);
  };

  // ================= UI =================
  return (
    <PageLayout title="Articles">

      {/* FORM */}
      <form onSubmit={handleSubmit} className="card p-3">

        <FormField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="form-control mb-2"
          rows={4}
        />

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
      <DataTable columns={["Image", "Title", "Content", "Actions"]}>
        {(articles || []).map((item) => (
          <tr key={item.id}>
            <td>
              {item.image_url && (
                <img
                  src={item.image_url}
                  width="60"
                  alt=""
                />
              )}
            </td>

            <td>{item.title}</td>

            <td>
              {item.content?.length > 80
                ? item.content.slice(0, 80) + "..."
                : item.content}
            </td>

            <td>
              <ActionButtons
                actions={[
                  {
                    label: "delete",
                    variant: "danger",
                    onClick: () => handleDelete(item.id),
                  },
                  {
                    label: "edit",
                    variant: "light",
                    onClick: () => handleEdit(item),
                  },
                ]}
              />
            </td>
          </tr>
        ))}
      </DataTable>

    </PageLayout>
  );
}

export default Blogs;
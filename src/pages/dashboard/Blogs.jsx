import { useEffect, useState } from "react";
import { adminAPI, publicAPI, STORAGE_URL } from "../../service/api";

function Blogs() {
  const [articles, setArticles] = useState([]);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: null,
  });

  const [editingId, setEditingId] = useState(null);

  // ================= FETCH
  const fetchData = async () => {
    try {
      const res = await publicAPI.getArticles();
      setArticles(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image_url") {
      setForm({ ...form, image_url: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================= CREATE / UPDATE
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
        await adminAPI.updateArticle(editingId, formData);
      } else {
        await adminAPI.createArticle(formData);
      }
console.log(form.image_url);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  // ================= EDIT
  const handleEdit = (item) => {
    setForm({
      title: item.title,
      content: item.content,
      image_url: null,
    });

    setEditingId(item.id);
  };

  // ================= DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await adminAPI.deleteArticle(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      image_url: null,
    });
    setEditingId(null);
  };

  return (
    <div className="container mt-4">
      <h2>Manage Articles</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          type="file"
          name="image_url"
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
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {articles.map((item) => (
            <tr key={item.id}>
              <td>
                {item.image_url && (
                  <img src={STORAGE_URL + item.image_url} width="60" />
                )}
              </td>
              <td>{item.title}</td>
              <td>{item.content}</td>
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

export default Blogs;
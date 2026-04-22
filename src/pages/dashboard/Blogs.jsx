import { adminAPI, publicAPI, STORAGE_URL } from "../../service/api";

import CrudCard from "./components/Card";
import CrudModal from "./components/Modal";
import { useCrudPage } from "./hooks/useCrudPage";

function Blogs() {

  // ================= CRUD HOOK =================
  const {
    data: articles = [],
    loading,
    formData,
    setFormData,
    showModal,
    setShowModal,
    openCreate,
    openEdit,
    create,
    update,
    remove,
  } = useCrudPage({
    getAll: publicAPI.getArticles,
    create: adminAPI.createArticle,
    update: adminAPI.updateArticle,
    delete: adminAPI.deleteArticle,
  });

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    if (formData.id) {
      await update(formData.id, data);
    } else {
      await create(data);
    }

    setShowModal(false);
  };

  // ================= FIELDS =================
  const fields = [
    { name: "title", label: "Title" },
    { name: "content", label: "Content", type: "textarea" },
    { name: "image_url", label: "Image", type: "file" },
  ];

  return (
    <div className="container py-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between mb-3">
        <h4>Articles</h4>

        <button className="btn btn-dark" onClick={openCreate}>
          Add Article
        </button>
      </div>

      {/* GRID */}
      <div className="row g-3">

        {(articles || []).map((item) => (
          <div className="col-md-4" key={item.id}>

            <CrudCard
              title={item.title}
              subtitle={
                item.content?.length > 80
                  ? item.content.slice(0, 80) + "..."
                  : item.content
              }
              image={
                item.image_url
                  ? STORAGE_URL + item.image_url
                  : null
              }
              onEdit={() => openEdit(item)}
              onDelete={() => remove(item.id)}
            />

          </div>
        ))}

      </div>

      {/* MODAL */}
      <CrudModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={formData.id ? "Edit Article" : "Create Article"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        fields={fields}
        loading={loading}
      />

    </div>
  );
}

export default Blogs;
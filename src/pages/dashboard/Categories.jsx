import CrudModal from "./components/Modal";
import CrudCard from "./components/Card";
import { useCrudPage } from "./hooks/useCrudPage";
import { adminAPI, publicAPI } from "../../service/api";

export default function Categories() {

  const {
    data: categories,
    loading,
    formData,
    setFormData,
    showModal,
    setShowModal,
    create,
    update,
    remove,
    openCreate,
    openEdit,
  } = useCrudPage({
    getAll: publicAPI.getCategories,
    create: adminAPI.createCategory,
    update: adminAPI.updateCategory,
    delete: adminAPI.deleteCategory,
  });

  const fields = [
    { name: "name", label: "Category Name" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.id) {
      await update(formData.id, formData);
    } else {
      await create(formData);
    }

    setShowModal(false);
  };

  return (
    <div className="container py-3">

      <button className="btn btn-dark mb-3" onClick={openCreate}>
        Add Category
      </button>

      <div className="row g-3">

        {(categories || []).map((cat) => (
          <div className="col-md-4" key={cat.id}>
            <CrudCard
              title={cat.name}
              subtitle={`ID: ${cat.id}`}
              onEdit={() => openEdit(cat)}
              onDelete={() => remove(cat.id)}
            />
          </div>
        ))}

      </div>

      <CrudModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Category"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        fields={fields}
      />

    </div>
  );
}
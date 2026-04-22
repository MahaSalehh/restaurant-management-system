import { adminAPI, publicAPI, STORAGE_URL } from "../../service/api";
import { useCrudPage } from "./hooks/useCrudPage";
import CrudCard from "./components/Card";
import CrudModal from "./components/Modal";
import { useEffect, useState } from "react";

function MenuItems() {

  const {
    data: items = [],
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
    getAll: publicAPI.getMenuItems,
    create: adminAPI.createMenuItem,
    update: adminAPI.updateMenuItem,
    delete: adminAPI.deleteMenuItem,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await publicAPI.getCategories();
      setCategories(res.data.data || []);
    })();
  }, []);

  const fields = [
    { name: "name", label: "Name" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "price", label: "Price", type: "number" },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categories.map(c => ({
        label: c.name,
        value: c.id,
      })),
    },
    { name: "image_url", label: "Image", type: "file" },
  ];

  const handleSubmit = async () => {

    const data = new FormData();

    Object.keys(formData).forEach((k) => {
      if (formData[k]) data.append(k, formData[k]);
    });

    if (formData.id) {
      await update(formData.id, data);
    } else {
      await create(data);
    }

    setShowModal(false);
  };

  return (
    <div className="container py-3">

      <div className="d-flex justify-content-between mb-3">
        <h3>Menu Items</h3>
        <button className="btn btn-dark" onClick={openCreate}>
          Add
        </button>
      </div>

      <div className="row g-3">

        {items.map((item) => (
          <div className="col-md-4" key={item.id}>

            <CrudCard
              title={item.name}
              subtitle={item.price}
              image={item.image_url ? STORAGE_URL + item.image_url : null}
              onEdit={() => openEdit(item)}
              onDelete={() => remove(item.id)}
            />

          </div>
        ))}

      </div>

      <CrudModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Menu Item"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        fields={fields}
        loading={loading}
      />

    </div>
  );
}

export default MenuItems;
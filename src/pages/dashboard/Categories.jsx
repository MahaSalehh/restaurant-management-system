import { useState, useCallback } from "react";
import {
  Container, Table, Badge, Button, Form, Spinner, Modal,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { adminAPI, publicAPI } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useToastError } from "../../hooks/useToastsError";
import { useToast } from "../../context/ToastContext";

function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedCat, setSelectedCat] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { showToast } = useToast();

  const fetchCategories = useCallback(() => publicAPI.getCategories(), []);
  const { data, loading, error, execute: refetch } = useAsync(fetchCategories);
  useToastError(error);

  const categories = data?.data ?? data ?? [];

  function openAdd() {
    setModalMode("add");
    setFormData({ name: "", description: "" });
    setShowModal(true);
  }

  function openEdit(cat) {
    setModalMode("edit");
    setSelectedCat(cat);
    setFormData({ name: cat.name, description: cat.description || "" });
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await adminAPI.deleteCategory(id);
      showToast("success", "Category deleted");
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (modalMode === "add") await adminAPI.createCategory(formData);
      else await adminAPI.updateCategory(selectedCat.id, formData);
      showToast("success", modalMode === "add" ? "Category created" : "Category updated");
      setShowModal(false);
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to save category");
    }
  }

  return (
    <Container fluid className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>Categories</h2>
          <p className="text-muted mb-0">Organize your menu into categories</p>
        </div>
        <Button variant="primary" onClick={openAdd}><FaPlus className="me-2" />Add Category</Button>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table responsive hover bordered className="align-middle">
          <thead className="table-dark">
            <tr><th>#</th><th>Name</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id}>
                <td>{i + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.description || "—"}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-secondary" onClick={() => openEdit(cat)}><FaEdit /></Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(cat.id)}><FaTrash /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "add" ? "Add Category" : "Edit Category"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control required value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">{modalMode === "add" ? "Create" : "Update"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Categories;
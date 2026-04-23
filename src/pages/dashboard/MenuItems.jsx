import { useState, useCallback } from "react";
import {
  Container, Row, Col, Card, Badge, Button, InputGroup,
  Form, Spinner, Modal,
} from "react-bootstrap";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { adminAPI, publicAPI } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useToastError } from "../../hooks/useToastsError";
import { useToast } from "../../context/ToastContext";

const STORAGE_BASE = "https://restaurant-api-production-b087.up.railway.app/storage/";
const imgSrc = (path) =>
  !path ? null : path.startsWith("http") ? path : `${STORAGE_BASE}${path}`;

function MenuItems() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category_id: "", image: null,
  });
  const { showToast } = useToast();

  const fetchItems = useCallback(() => publicAPI.getMenuItems(), []);
  const fetchCats  = useCallback(() => publicAPI.getCategories(), []);

  const { data: itemsData, loading: itemsLoading, error: itemsError, execute: refetchItems } = useAsync(fetchItems);
  const { data: catsData, error: catsError } = useAsync(fetchCats);

  useToastError(itemsError);
  useToastError(catsError);

  const items      = itemsData?.data ?? itemsData ?? [];
  const categories = catsData?.data  ?? catsData  ?? [];
  const filtered   = items.filter(item =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setModalMode("add");
    setFormData({ name: "", description: "", price: "", category_id: "", image: null });
    setShowModal(true);
  }

  function openEdit(item) {
    setModalMode("edit");
    setSelectedItem(item);
    setFormData({
      name: item.name, description: item.description || "",
      price: item.price, category_id: item.category_id || "", image: null,
    });
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this menu item?")) return;
    try {
      await adminAPI.deleteMenuItem(id);
      showToast("success", "Item deleted");
      refetchItems();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => { if (v !== null && v !== "") fd.append(k, v); });
    try {
      if (modalMode === "add") await adminAPI.createMenuItem(fd);
      else await adminAPI.updateMenuItem(selectedItem.id, fd);
      showToast("success", modalMode === "add" ? "Item created" : "Item updated");
      setShowModal(false);
      refetchItems();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to save item");
    }
  }

  return (
    <Container fluid className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>Menu Items</h2>
          <p className="text-muted mb-0">Browse, search, and manage menu items</p>
        </div>
        <Button variant="primary" onClick={openAdd}><FaPlus className="me-2" />Add Item</Button>
      </div>

      <Row className="mb-4">
        <Col md={5}>
          <InputGroup>
            <Form.Control placeholder="Search menu items..." value={search}
              onChange={e => setSearch(e.target.value)} />
            <InputGroup.Text><FaSearch /></InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      {itemsLoading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Row className="g-4">
          {filtered.map(item => (
            <Col key={item.id} xl={3} lg={4} md={6}>
              <Card className="h-100 border-0 shadow-sm">
                {item.image && (
                  <Card.Img variant="top" src={imgSrc(item.image)}
                    style={{ height: "180px", objectFit: "cover" }} />
                )}
                <Card.Body className="d-flex flex-column">
                  <Badge bg="secondary" className="mb-2 align-self-start">{item.category?.name || "—"}</Badge>
                  <Card.Title className="h6">{item.name}</Card.Title>
                  <Card.Text className="text-muted small">{item.description?.substring(0, 60)}...</Card.Text>
                  <div className="mt-auto">
                    <h5 className="fw-bold" style={{ color: "var(--primary-color)" }}>${item.price}</h5>
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="primary" className="flex-fill"
                        onClick={() => { setSelectedItem(item); setShowDetailModal(true); }}><FaEye /></Button>
                      <Button size="sm" variant="outline-secondary" className="flex-fill"
                        onClick={() => openEdit(item)}><FaEdit /></Button>
                      <Button size="sm" variant="outline-danger" className="flex-fill"
                        onClick={() => handleDelete(item.id)}><FaTrash /></Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "add" ? "Add Menu Item" : "Edit Menu Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control required value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control required type="number" step="0.01" value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select required value={formData.category_id}
                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" accept="image/*"
                    onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">{modalMode === "add" ? "Create" : "Update"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Item Details</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <Row>
              <Col md={5}>
                {selectedItem.image && (
                  <img src={imgSrc(selectedItem.image)} alt={selectedItem.name} className="img-fluid rounded" />
                )}
              </Col>
              <Col md={7}>
                <h4>{selectedItem.name}</h4>
                <Badge bg="secondary" className="mb-2">{selectedItem.category?.name}</Badge>
                <p className="text-muted">{selectedItem.description}</p>
                <hr />
                <p><strong>Price:</strong> ${selectedItem.price}</p>
                <p><strong>Category ID:</strong> {selectedItem.category_id}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MenuItems;
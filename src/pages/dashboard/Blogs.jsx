import { useState, useCallback } from "react";
import {
  Container, Row, Col, Card, Button, InputGroup,
  Form, Spinner, Modal,
} from "react-bootstrap";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { adminAPI, publicAPI, STORAGE_URL } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useToastError } from "../../hooks/useToastsError";
import { useToast } from "../../context/ToastContext";

function Blogs() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: null,
  });

  const { showToast } = useToast();

  const fetchArticles = useCallback(() => publicAPI.getArticles(), []);

  const {
    data,
    loading,
    error,
    execute: refetch
  } = useAsync(fetchArticles);

  useToastError(error);

  const articles = data?.data ?? data ?? [];

  const filtered = articles.filter(a =>
    (a.title || "").toLowerCase().includes(search.toLowerCase())
  );


  function getImage(article) {
    if (!article?.image_url) return "/placeholder-food.jpg";

    return STORAGE_URL + article.image_url;
  }

  function openAdd() {
    setModalMode("add");
    setFormData({ title: "", content: "", image_url: null });
    setShowModal(true);
  }

  function openEdit(article) {
    setModalMode("edit");
    setSelectedArticle(article);

    setFormData({
      title: article.title,
      content: article.content || "",
      image_url: null,
    });

    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this article?")) return;

    try {
      await adminAPI.deleteArticle(id);
      showToast("success", "Article deleted");
      refetch();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("content", formData.content);

    if (formData.image_url) {
      fd.append("image_url", formData.image_url);
    }

    try {
      if (modalMode === "add") {
        await adminAPI.createArticle(fd);
      } else {
        await adminAPI.updateArticle(selectedArticle.id, fd);
      }

      showToast(
        "success",
        modalMode === "add" ? "Article created" : "Article updated"
      );

      setShowModal(false);
      refetch();
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to save article"
      );
    }
  }

  return (
    <Container fluid className="py-3">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Articles
          </h2>
          <p className="text-muted mb-0">
            Manage your blog posts and news articles
          </p>
        </div>

        <Button variant="primary" onClick={openAdd}>
          <FaPlus className="me-2" />
          Add Article
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={5}>
          <InputGroup>
            <Form.Control
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="g-4">

          {filtered.map(article => (
            <Col key={article.id} xl={4} md={6}>

              <Card className="h-100 border-0 shadow-sm">

                <Card.Img
                  variant="top"
                  src={getImage(article)}
                  onError={(e) => {
                    e.target.src = "/placeholder-food.jpg";
                  }}
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />

                <Card.Body className="d-flex flex-column">

                  <Card.Title className="h6">
                    {article.title}
                  </Card.Title>

                  <Card.Text className="text-muted small">
                    {article.content
                      ?.replace(/<[^>]+>/g, "")
                      .substring(0, 80)}...
                  </Card.Text>

                  <div className="mt-auto d-flex gap-2">

                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-fill"
                      onClick={() => {
                        setSelectedArticle(article);
                        setShowDetailModal(true);
                      }}
                    >
                      <FaEye />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="flex-fill"
                      onClick={() => openEdit(article)}
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="flex-fill"
                      onClick={() => handleDelete(article.id)}
                    >
                      <FaTrash />
                    </Button>

                  </div>

                </Card.Body>

              </Card>

            </Col>
          ))}

        </Row>
      )}

      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedArticle?.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedArticle && (
            <>
              {selectedArticle.image_url && (
                <img
                  src={getImage(selectedArticle)}
                  alt={selectedArticle.title}
                  className="img-fluid rounded mb-3 w-100"
                  style={{ maxHeight: 300, objectFit: "cover" }}
                />
              )}

              <div
                dangerouslySetInnerHTML={{
                  __html: selectedArticle.content,
                }}
              />
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add Article" : "Edit Article"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={e =>
                  setFormData({
                    ...formData,
                    image_url: e.target.files[0],
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={formData.content}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: e.target.value,
                  })
                }
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>

              <Button type="submit" variant="primary">
                {modalMode === "add" ? "Publish" : "Update"}
              </Button>
            </div>

          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Blogs;
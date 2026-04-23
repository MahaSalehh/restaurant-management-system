import { useCallback } from "react";
import {
  Container, Table, Badge, Spinner, Modal, Button,
} from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import { adminAPI } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useToastError } from "../../hooks/useToastsError";

// If your API has an admin contacts endpoint, swap here:
// e.g. const fetchMessages = useCallback(() => adminAPI.getContacts(), []);
// For now we assume it lives under adminAPI or a similar endpoint.

function Messages() {
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Adjust the API call to match your actual contacts endpoint
  const fetchMessages = useCallback(() => adminAPI.getContacts?.() ?? Promise.resolve({ data: [] }), []);
  const { data, loading, error } = useAsync(fetchMessages);
  useToastError(error);

  const messages = data?.data ?? data ?? [];

  return (
    <Container fluid className="py-3">
      <h2 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>Messages</h2>
      <p className="text-muted mb-4">Customer contact form submissions</p>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : messages.length === 0 ? (
        <p className="text-muted">No messages yet.</p>
      ) : (
        <Table responsive hover bordered className="align-middle">
          <thead className="table-dark">
            <tr><th>#</th><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {messages.map((msg, i) => (
              <tr key={msg.id}>
                <td data-label="#">{i + 1}</td>
                <td data-label="Name">{msg.name}</td>
                <td data-label="Email">{msg.email}</td>
                <td data-label="Subject">{msg.subject || "—"}</td>
                <td data-label="Date">{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : "—"}</td>
                <td data-label="Actions">
                  <Button size="sm" variant="primary"
                    onClick={() => { setSelectedMsg(msg); setShowModal(true); }}>
                    <FaEye />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Message from {selectedMsg?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMsg && (
            <>
              <p><strong>Name:</strong> {selectedMsg.name}</p>
              <p><strong>Email:</strong> {selectedMsg.email}</p>
              {selectedMsg.phone && <p><strong>Phone:</strong> {selectedMsg.phone}</p>}
              {selectedMsg.subject && <p><strong>Subject:</strong> {selectedMsg.subject}</p>}
              <hr />
              <h5><strong>“{selectedMsg.message}”</strong></h5>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Messages;
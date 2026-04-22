import { Container } from "react-bootstrap";

export default function PageLayout({ title, children }) {
  return (
    <Container fluid className="dash-page py-3">

      {/* HEADER */}
      <div className="dash-header mb-3">

        <h3 className="fw-bold" style={{ color: "var(--primary-color)" }}>
          {title}
        </h3>

      </div>

      {/* CONTENT */}
      {children}

    </Container>
  );
}
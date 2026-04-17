import { Container } from "react-bootstrap";

export default function PageLayout({ title, actions, children }) {
  return (
    <div className="dash-page">
      <Container fluid>

        <div className="dash-header">
          <h2>{title}</h2>
          <div>{actions}</div>
        </div>

        {children}

      </Container>
    </div>
  );
}
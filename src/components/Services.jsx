import { Container, Row, Col, Card } from "react-bootstrap";

import service1 from "../assets/Home/service.png";
import service2 from "../assets/Home/service1.png";
import service3 from "../assets/Home/service2.png";
import service4 from "../assets/Home/service3.png";

const Services = () => {
  const services = [
    { title: "Catering", img: service1 },
    { title: "Birthday", img: service2 },
    { title: "Weddings", img: service3 },
    { title: "Events", img: service4 },
  ];

  return (
    <section className="py-5">
      <Container>

        <h2 className="h2 text-start text-container">
          We also offer unique services for your events
        </h2>

        <Row className="mt-4 g-4">

          {services.map((s, i) => (
            <Col lg={3} md={6} sm={6} xs={6} key={i}>
              <Card className="service-card h-100 border-0">

                <Card.Img
                  src={s.img}
                  className="service-img"
                />

                <div className="pt-4">
                  <h3 className="h3 body-xl-bold">
                    {s.title}
                  </h3>

                  <p className="body-md neutral6">
                    In the new era of technology we look in the future with certainty for life.
                  </p>
                </div>

              </Card>
            </Col>
          ))}

        </Row>

      </Container>
    </section>
  );
};

export default Services;
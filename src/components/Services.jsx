import React from "react";
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
            <Col md={3} sm={6} xs={12} key={i}>
              <Card className="service-card h-100 border-0">
                
                <Card.Img
                  src={s.img}
                  className="service-img"
                />

                <Card.Body className="text-start">
                  <h6 className="body-md body-md-bold">
                    {s.title}
                  </h6>

                  <p className="body-sm mt-2">
                    In the new era of technology we look in the future with certainty for life.
                  </p>
                </Card.Body>

              </Card>
            </Col>
          ))}

        </Row>
      </Container>
    </section>
  );
};

export default Services;
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import person1 from "../assets/Home/person1.svg";
import person2 from "../assets/Home/person2.svg";
import person3 from "../assets/Home/person3.svg";

const testimonials = [
  {
    quote: "“The best restaurant”",
    name: "Sophire Robson",
    address: "Los Angeles, CA",
    message:
      "Last night, we dined at place and were simply blown away. From the moment we stepped in, we were enveloped in an inviting atmosphere and greeted with warm smiles.",
    img: person1,
  },
  {
    quote: "“Simply delicious”",
    name: "Matt Cannon",
    address: "San Diego, CA",
    message:
      "Place exceeded my expectations on all fronts. The ambiance was cozy and relaxed, making it a perfect venue for our anniversary dinner. Each dish was prepared and beautifully presented.",
    img: person2,
  },
  {
    quote: "“One of a kind restaurant”",
    name: "Andy Smith",
    address: "San Francisco, CA",
    message:
      "The culinary experience at place is first to none. The atmosphere is vibrant, the food - nothing short of extraordinary. The food was the highlight of our evening. Highly recommended.",
    img: person3,
  },
];

const CustomersSays = () => {
  return (
    <section className="py-5">
      <Container>

        <h2 className="h2 text-center mb-5">
          What Our Customers Say
        </h2>

        <Row className="g-4">

          {testimonials.map((t, i) => (
            <Col lg={4} md={4} sm={6} xs={12} key={i}>

              <Card className="card-base card-padding-md card-hover-shadow text-start bg-light-section">

                <h3 className="h3 mb-3 primary">
                  {t.quote}
                </h3>

                <p className="body-sm testimonial-message mb-4">
                  {t.message}
                </p>

                <div className="divider-line"></div>

                <div className="d-flex align-items-center gap-3 mt-4">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="rounded-circle"
                    width="50"
                    height="50"
                  />

                  <div>
                    <h6 className="mb-0 body-md body-md-bold">
                      {t.name}
                    </h6>
                    <small className="text-muted body-sm">
                      {t.address}
                    </small>
                  </div>
                </div>

              </Card>

            </Col>
          ))}

        </Row>

      </Container>
    </section>
  );
};

export default CustomersSays;
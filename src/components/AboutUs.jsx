import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiPhone } from "react-icons/fi";
import { FaRegEnvelope } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";

function AboutUs({ img }) {
  return (
    <section className="about-section section bg-light-section">
      <Container>
        <Row className="align-items-center g-4">

          {/* LEFT IMAGE */}
          <Col lg={5} md={5} className="position-relative text-center">
          <div className="about-img-wrapper">
            <img src={img} alt="food" className="about-img img-fluid rounded-4" />

            <div className="contact-card text-start neutral1 neutral9">
              <h3 className="h3 neutral1 mb-5">
                Come and visit us
              </h3>

              <p className="body-sm d-flex align-items-center gap-2">
                <FiPhone /> (414) 857 - 0107
              </p>

              <p className="body-sm d-flex align-items-center gap-2">
                <FaRegEnvelope /> happytummy@restaurant.com
              </p>

              <p className="body-sm d-flex align-items-start gap-2">
                <HiOutlineLocationMarker />
                <span>
                  837 W. Marshall Lane Marshalltown, IA 50158, Los Angeles
                </span>
              </p>
            </div>
            </div>
          </Col>

          {/* RIGHT TEXT */}
          <Col lg={7} md={7} className="d-flex align-items-center ps-lg-5">
            <div className="about-content text-container-md text-left mx-lg-auto">
              <h2 className="h2 mb-4">
                We provide healthy food for your family.
              </h2>

              <p className="body-lg body-lg-medium neutral7 mb-4">
                Our story began with a vision to create a unique dining
                experience that merges fine dining, exceptional service, and a
                vibrant ambiance. Rooted in city's rich culinary culture, we aim
                to honor our local roots while infusing a global palate.
              </p>

              <p className="body-sm neutral6">
                At place, we believe that dining is not just about food, but also
                about the overall experience. Our staff, renowned for their
                warmth and dedication, strives to make every visit an
                unforgettable event.
              </p>
            </div>
          </Col>

        </Row>
      </Container>
    </section>
  );
}

export default AboutUs;
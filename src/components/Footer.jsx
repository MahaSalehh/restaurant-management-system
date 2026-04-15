import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaGithub
} from "react-icons/fa";

import img1 from "../assets/Home/1.png";
import img2 from "../assets/Home/2.png";
import img3 from "../assets/Home/3.png";
import img4 from "../assets/Home/4.png";
import logo from "../assets/logo1.svg";
const instaImages = [img1, img2, img3, img4];

const Footer = () => {
  return (
    <footer className="footer-wrapper bg-dark-section py-5">
      <Container>
        <Row className="gy-4">

          {/* Column 1 - Brand */}
          <Col md={3}>
          <div className="d-flex align-items-center footer-logo neutral1">
          <img src={logo} alt="Logo" className="logo" />
            <h4 className="">Bistro Bliss</h4>
            </div>
            <p className="body-sm neutral4">
              In the new era of technology we look a in the future with certainty and pride to for our company and.
            </p>

            <div className="d-flex footer-social-icons neutral1 mt-3">
              <FaTwitter />
              <FaFacebookF />
              <FaInstagram />
              <FaGithub />
            </div>
          </Col>

          <Col md={1} />

          {/* Column 2 - Pages */}
          <Col md={2}>
            <h6 className="body-md body-md-bold neutral1 mb-3">Pages</h6>
            <ul className="footer-links neutral3">
              <li>Home</li>
              <li>About</li>
              <li>Menu</li>
              <li>Pricing</li>
              <li>Pricing</li>
              <li>Pricing</li>
              <li>Delivery</li>
            </ul>
          </Col>

          {/* Column 3 - Contact */}
          <Col md={3}>
            <h6 className="body-md body-md-bold neutral1 mb-3">Utility Pages</h6>
            <ul className="footer-links neutral3">
              <li>Start Here</li>
              <li>Styleguide</li>
              <li>Password Protected</li>
              <li>404 Not Found</li>
              <li>Licenses</li>
              <li>Changelog</li>
              <li>View More</li>

            </ul>
          </Col>

          {/* Column 4 - Instagram */}
          <Col md={3}>
            <h6 className="body-md body-md-bold neutral1 mb-3">
              Follow Us On Instagram
            </h6>

            <div className="insta-grid">
              {instaImages.map((img, i) => (
                <img key={i} src={img} alt={`insta-${i}`} />
              ))}
            </div>
          </Col>

        </Row>

        <hr className="footer-line" />

        <p className="text-center body-sm neutral4 mb-0">
          Copyright © 2023 Hashtag Developer. All Rights Reserved
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
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
import { Link } from "react-router-dom";

const instaImages = [img1, img2, img3, img4];

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">

        <div className="footer-main">

          <div className="footer-col">
            <div className="footer-logo">
              <img src={logo} alt="logo" className="logo" />
              <h4>Bistro Bliss</h4>
            </div>

            <p className="footer-desc neutral4">
              In the new era of technology we look a in the future with certainty and pride to for our company and.
            </p>

            <div className="footer-social">
              <Link to="https://twitter.com"><FaTwitter /></Link>
              <Link to="https://facebook.com"><FaFacebookF /></Link>
              <Link to="https://instagram.com"><FaInstagram /></Link>
              <Link to="https://github.com"><FaGithub /></Link>
            </div>
          </div>

          <div className="footer-col">
            <h6>Pages</h6>
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Menu</li>
              <li>Pricing</li>
              <li>Blog</li>
              <li>Contact</li>
              <li>Delivery</li>
            </ul>
          </div>

          <div className="footer-col">
            <h6>Utility Pages</h6>
            <ul>
              <li>Start Here</li>
              <li>Styleguide</li>
              <li>Password Protected</li>
              <li>404 Not Found</li>
              <li>Licenses</li>
              <li>Changelog</li>
              <li>View More</li>
            </ul>
          </div>

          <div className="footer-col footer-images">
            <h6>Follow Us On Instagram</h6>

            <div className="insta-grid">
              {instaImages.map((img, i) => (
                <img key={i} src={img} alt="" />
              ))}
            </div>
          </div>

        </div>

        <div className="footer-bottom neutral4">
          Copyright © 2023 Hashtag Developer. All Rights Reserved
        </div>

      </div>
    </footer>
  );
};

export default Footer;
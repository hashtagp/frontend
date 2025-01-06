import React from "react";
import "./Footer.css";
import logo from "../assets/footer_logo.png"; // Replace with your logo path
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {

  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="logo">
        {/* Logo Section */}
        <div className="footer-logo">
          <img src={logo} alt="Dev Creations" />
        </div>

        <div className="footer-section query">
          <h2>Have Enquiries?</h2>
          <div className="footer-query">
          <input
              type="email"
              placeholder="Your E-Mail"
            />
          </div>
          <div className="submit-container">
          <button>Submit</button>
          <p>We will get back to you soon !!</p>
          </div>
        </div>

{/* <h3>Have Enquiries?</h3>
          <div className="footer-search-bar">
            <input type="email" placeholder="Your E-Mail" />
          </div>
          <div className="submit-container">
            <button>Submit</button>
            <p>We will get back to you soon!</p>
          </div> */}
        </div>
        <div className="info">
        {/* Services Section */}
        <div className="footer-section">
          <h3>OUR SERVICES</h3>
          <ul>
            <li><a href="https://devcreationsblr.com/services.html">Educational courses</a></li>
            <li><a href="https://devcreationsblr.com/services.html">E-Services</a></li>
            <li><a href="https://devcreationsblr.com/services.html">Office Gifts</a></li>
            <li><a href="https://devcreationsblr.com/services.html">Design and Printing</a></li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="footer-section">
          <h3>COMPANY</h3>
          <ul>
            <li><a onClick={()=>navigate("/about-us")}>About</a></li>
            <li><a onClick={()=>navigate("/faq")}>FAQ</a></li>
            <li><a href="#!">Collaborations</a></li>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="footer-section">
          <h3>LEGAL</h3>
          <ul>
            <li><a onClick={()=>navigate("/terms-and-conditions")}>Terms and Conditions</a></li>
            <li><a onClick={()=>navigate("/return-policy")}>Return Policy</a></li>
            <li><a onClick={()=>navigate("/contact")}>Support</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>CONTACTS</h3>
          <p>+91 73378 40612</p>
          <ul className="social-links">
            <li><FaLinkedin /></li>
            <li><FaInstagram /></li>
            <li><FaYoutube /></li>
          </ul>
        </div>
        </div>
        </div>

      <hr/>

      <div className="footer-bottom">
        <p>© 2024 DevCreations and Solutions</p>
      </div>
    </footer>
  );
};

export default Footer;

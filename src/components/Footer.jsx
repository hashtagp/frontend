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
          <div className="map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62104.86627642231!2d77.7427292!3d13.0476392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae0f6a591b8b0d%3A0xa50642f22dcdf97f!2sDev%20creations%20%26%20solutions!5e0!3m2!1sen!2sin!4v1732180678544!5m2!1sen!2sin"
                        width="100%" height="100%" style={{border:0+'px'}} loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"></iframe>
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

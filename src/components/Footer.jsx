import React, { useContext, useState } from "react";
import "./Footer.css";
import logo from "../assets/footer_logo.png"; // Replace with your logo path
import { FaInstagram, FaLinkedin, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";

const Footer = () => {
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleSubmit = async () => {
    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus({ loading: false, success: false, error: "Please enter a valid email address." });
      return;
    }
    
    try {
      setStatus({ loading: true, success: false, error: null });
      
      await axios.post(url+'/api/users/inquiry', { email });
      
      setStatus({ loading: false, success: true, error: null });
      setEmail(""); // Clear the input after successful submission
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatus({ loading: false, success: false, error: "Failed to submit. Please try again." });
    }
  };

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="submit-container">
          <button 
            onClick={handleSubmit}
            disabled={status.loading}
          >
            {status.loading ? "Submitting..." : "Submit"}
          </button>
          <p>
            {status.success 
              ? "Thanks! We'll get back to you soon." 
              : status.error 
                ? status.error 
                : "We will get back to you soon !!"}
          </p>
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
            <li><a href="https://www.linkedin.com/company/dev-creations-and-solutions/"><FaLinkedin /></a></li>
            <li><a href="https://www.instagram.com/dev_creationsblr/profilecard/?igsh=Y3Z6b2Y0cm9yd3hx"><FaInstagram /></a></li>
            <li><a href="https://wa.me/+919945250080"><FaWhatsapp /></a></li>
            <li><a href="https://www.facebook.com/profile.php?id=61569558881823&mibextid=ZbWKwL"><FaFacebook /></a></li>
            <li><a href="https://x.com/DevCreations0?t=NAdYpGZ_Y8zR-UUWdPM0nw&s=08"><FaXTwitter /></a></li>
          </ul>
        </div>
        </div>
        </div>

      <hr/>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Dev Creations and Solutions. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
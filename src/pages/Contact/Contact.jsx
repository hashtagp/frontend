import React from 'react';
import './Contact.css';

const Contact = () => {

  window.scrollTo(0, 0);

  return (
    <section id="contact-details" className="section">
      <div className="contact">
        <h2>Contact Us</h2>
        <p>
          If you have any questions, concerns, or feedback, please don't hesitate to reach out. 
          Our customer service team is here to assist you!
        </p>

        <section className="contact-info">
          <h3>Contact Information</h3>
          <ul>
            <li>
              <i className="fa-solid fa-envelope"></i>
              <p>
                <a href="mailto:info@devcreations.com">info@devcreations.com</a>
                <br />
                Response Time: Within 24 hours
              </p>
            </li>
            <li>
              <i className="fa-solid fa-map"></i>
              <p>
                1st face, 88, KR Defense Colony, Cheemasandra
                <br />
                Bengaluru, Karnataka - 560049, India
              </p>
            </li>
          </ul>
        </section>

        <div className="social-media">
          <p>Follow Us on Social Media</p>
          <ul>
            <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="https://www.instagram.com/dev_creationsblr/"><i className="fab fa-instagram"></i></a></li>
            <li><a href="#"><i className="fab fa-twitter"></i></a></li>
            <li><a href="https://www.linkedin.com/company/dev-creations-and-solutions/"><i className="fab fa-linkedin-in"></i></a></li>
          </ul>
        </div>
      </div>
      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62104.86627642231!2d77.7427292!3d13.0476392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae0f6a591b8b0d%3A0xa50642f22dcdf97f!2sDev%20creations%20%26%20solutions!5e0!3m2!1sen!2sin!4v1732180678544!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default Contact;

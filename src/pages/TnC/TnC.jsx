import React from "react";
import "./TnC.css";

const TermsAndConditions = () => {

  window.scrollTo(0, 0);

  return (
    <div className="terms-container">
      <header>
        <h1>Terms and Conditions</h1>
        <p><strong>Last Updated on:</strong> 02 Dec 2024</p>
      </header>

      <p>
        Welcome to Dev Creations and Solutions. These Terms and Conditions
        outline the rules and regulations for the use of our website and
        services.
      </p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our website, you agree to comply with and be
          bound by these Terms and Conditions. If you do not agree with any
          part of these terms, you must not use our services.
        </p>
      </section>

      <section>
        <h2>2. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms and Conditions at any
          time. Any changes will be effective immediately upon posting the
          revised terms on our website. Your continued use of the site after
          changes are made constitutes your acceptance of the new terms.
        </p>
      </section>

      <section>
        <h2>3. User Accounts</h2>
        <p>
          To access certain features of our service, you may be required to
          create an account. You agree to provide accurate, current, and
          complete information during the registration process and to update
          such information to keep it accurate, current, and complete.
        </p>
      </section>

      <section>
        <h2>4. User Responsibilities</h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account information and for all activities that occur under your
          account. You agree to notify us immediately of any unauthorized use
          of your account or any other breach of security.
        </p>
      </section>

      <section>
        <h2>5. Prohibited Activities</h2>
        <p>You agree not to engage in any of the following prohibited activities:</p>
        <ul>
          <li>Violating any applicable laws or regulations.</li>
          <li>Impersonating any person or entity.</li>
          <li>Transmitting any harmful or malicious code.</li>
          <li>Interfering with or disrupting the security, integrity, or performance of our services.</li>
        </ul>
      </section>

      <section>
        <h2>6. Intellectual Property</h2>
        <p>
          All content, trademarks, and other intellectual property on our
          website are the property of Dev Creations and Solutions or our
          licensors. You may not use, reproduce, or distribute any content
          without our express written permission.
        </p>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Dev Creations and Solutions
          shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising out of or in connection
          with your use of our services.
        </p>
      </section>

      <section>
        <h2>8. Governing Law</h2>
        <p>
          These Terms and Conditions shall be governed by and construed in
          accordance with the laws. Any disputes arising from these terms shall
          be resolved in the courts.
        </p>
      </section>

      <section>
        <h2>9. Contact Information</h2>
        <p>
          If you have any questions about these Terms and Conditions, please
          contact us at <a href="mailto:devcreationsblr@gmail.com">devcreationsblr@gmail.com</a>.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;

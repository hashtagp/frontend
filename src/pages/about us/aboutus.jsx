import React from 'react';
import aboutSection1 from "../../assets/about-section1.png";
import aboutSection2 from "../../assets/about-section2.svg";
import aboutSection3 from "../../assets/about-section3.svg";
import aboutSection4 from "../../assets/about-section4.svg";
import aboutSection5 from "../../assets/about-section5.svg";

const AboutUs = () => {
  return (
    <div className="bg-gray-100 font-sans">
      {/* About Us Section */}
      <section className="bg-white py-12">
        <div className="about-us mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Images Section */}
            <div className="flex flex-wrap gap-4 md:w-1/2">
              <img src={aboutSection1} alt="" className="rounded-lg w-full h-full object-cover" />
            </div>
            {/* Paragraph Section */}
            <div className="text-gray-700 text-lg leading-relaxed md:w-1/2">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">ABOUT US</h3>
              <p>
              Dev Creations is a versatile design-focused company dedicated to delivering impactful solutions. They specialize in UI/UX design, web and app development, poster and banner creation, and crafting customized office gifts. With a mission to bridge creativity and functionality, Dev Creations combines technical expertise with a deep understanding of client needs to create seamless user experiences and visually compelling designs. They are committed to building strong partnerships and exceeding expectations with every project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="bg-gray-50 py-12">
        <div className="about-us-cards mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img src={aboutSection2} alt="" className="rounded-lg w-full h-auto max-h-72 object-cover order-1 md:order-2" />
            <div className="text-gray-700 text-lg leading-relaxed order-2 md:order-1">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">WHO WE ARE</h3>
              <p>
                Dev Creations is a dynamic design-focused company dedicated to transforming ideas into impactful experiences. With a passion for design and a commitment to quality, we help businesses achieve their goals through intuitive design solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="bg-white py-12">
        <div className="about-us-cards mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img src={aboutSection3} alt="" className="rounded-lg w-full h-auto max-h-72 object-cover order-1 md:order-1" />
            <div className="text-gray-700 text-lg leading-relaxed order-2 md:order-2">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">OUR MISSION</h3>
              <p>
                Our mission is to bridge the gap between creativity and functionality by delivering user-centric designs that resonate with our clients and their audiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="bg-gray-50 py-12">
        <div className="about-us-cards mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img src={aboutSection4} alt="" className="rounded-lg w-full h-auto max-h-72 object-cover order-1 md:order-2" />
            <div className="text-gray-700 text-lg leading-relaxed order-2 md:order-1">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">OUR EXPERTISE</h3>
              <p>
                We specialize in UI/UX design, ensuring seamless user experiences through thoughtful interfaces and cutting-edge tools. Our team brings technical expertise and creativity to every project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-12">
        <div className="about-us-cards mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img src={aboutSection5} alt="" className="rounded-lg w-full h-auto max-h-72 object-cover order-1 md:order-1" />
            <div className="text-gray-700 text-lg leading-relaxed order-2 md:order-2">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">WHY CHOOSE US</h3>
              <p>
                At Dev Creations, we go beyond just design. We build partnerships, understanding our clients' needs deeply and delivering solutions that exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
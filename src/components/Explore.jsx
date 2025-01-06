import React, { useEffect, useState } from 'react';
import './Explore.css';
import combo from "../assets/combo.webp";
import models from "../assets/3d models.jpg";
import plant from "../assets/bonsai plants.jpg";
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleHover = () => { 
    setHovered(true);
  }

  useEffect(() => {
    const container = document.getElementById('imageContainer');
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const percentage = (cursorX / rect.width) * 100;

      image1.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      image2.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className='products'>
      <div className="main" onMouseEnter={handleHover}>
        <div className={`hover-message ${hovered ? "hidden" : ""}`} onMouseEnter={handleHover}>
          <h1 className={`${hovered ? "hidden" : ""}`} onMouseEnter={handleHover}>Hover me!!</h1>
        </div>
        <div className="image-container" id="imageContainer">
          <div className="image" id="image1"></div>
          <div className="image" id="image2"></div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
import React, { useEffect, useState } from 'react';
import './Explore.css';
import combo from "../assets/combo.webp";
import models from "../assets/3d models.jpg";
import plant from "../assets/bonsai plants.jpg";
import { useNavigate } from 'react-router-dom';
import left_right_icon from "../assets/left_right_icon.png";

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
    const divider = document.getElementById('divider');

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const percentage = (cursorX / rect.width) * 100;

      image1.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      image2.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      divider.style.left = `${cursorX}px`;
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className='products'>
      <div className="main" onMouseEnter={handleHover}>
        <div className="image-container" id="imageContainer">
          <div className="image" id="image1"></div>
          <div className="divider" id="divider">
            <img src={left_right_icon} alt="" />
          </div>
          <div className="image" id="image2"></div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
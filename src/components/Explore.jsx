import React, { useEffect, useState } from 'react';
import './Explore.css';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const container = document.getElementById('imageContainer');
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    const divider = document.getElementById('divider');
    const floatingMessage = document.querySelector('.floating-message');

    const handleMove = (clientX) => {
      const rect = container.getBoundingClientRect();
      const cursorX = clientX - rect.left;
      const percentage = (cursorX / rect.width) * 100;

      image1.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      image2.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      divider.style.left = `${cursorX}px`;

      // Dynamically center the floating message over the divider
      floatingMessage.style.left = `${cursorX}px`;

      // Hide the message after the first move
      if (showMessage) {
        setShowMessage(false);
      }
    };

    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [showMessage]);

  return (
    <div className='hero'>
      <div className="main">
        <div className="image-container" id="imageContainer">
          <div className="image" id="image1"></div>
          <div className="divider" id="divider">
            <div
              className={`floating-message ${showMessage ? 'show' : 'hidden'}`}
              onMouseEnter={() => setShowMessage(false)}
            >
              <h1>Move Me</h1>
              <p>Hover to see the magic</p>
            </div>
          </div>
          <div className="image" id="image2"></div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

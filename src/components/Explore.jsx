import React from 'react';
import './Explore.css';
import banner from "../assets/banner.png";
import combo from "../assets/combo.webp";
import models from "../assets/3d models.jpg";
import plant from "../assets/bonsai plants.jpg";
import merch from "../assets/merch.png";
import { useNavigate } from 'react-router-dom';

const Explore = () => {

  const navigate = useNavigate();
  return (
    <div className='Products'>
      <div className="category">
        <div className="product-c1">
        <div className="Product">
          <img onClick={()=>navigate("/products?category=All")} src={combo} alt="office gifts" />
          <p>Office Gifts</p>
        </div>
        <div className="Product">
          <img onClick={()=>navigate("/products?category=All")} src={models} alt="3D models" />
          <p>3D printing models</p>
        </div>
        </div>
        <div className="Product bonsai">
          <img onClick={()=>navigate("/products?category=Bonsai-plant")} src={plant} alt="Bonsai Plant" />
          <p>Bonsai Plants</p>
        </div>
        
      </div>
      <div className="main">
        <div className="main-product">
          <img src={banner} alt="banner" />
        </div>
      </div>
    </div>
  );
}

export default Explore;

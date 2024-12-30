import React from 'react';
import Slider from 'react-slick';
import './Home.css';
import mug from "../../assets/mug-home.webp"
import pens from "../../assets/pens-home.jpeg"
import keychains from "../../assets/keychains-home.jpeg"
import dairy from "../../assets/dairy-home.avif"
import mobilestand from "../../assets/Mobile-stand-home.jpg"
import penstand from "../../assets/pen-stand-home.jpeg"
import Explore from '../../components/Explore';
import om from "../../assets/om.svg"
import badge from "../../assets/badge.png"
import Women_banner from "../../assets/Women_banner.svg"
import explore_tWoman from "../../assets/explore_tWoman.svg"
import explore_badge from "../../assets/explore_badge.svg"
import explore_letterhead from "../../assets/explore_letterhead.svg"
import explore_banner from "../../assets/explore_banner.svg"
import explore_calender from "../../assets/explore_calender.svg"
import explore_certificate from "../../assets/explore_certificate.svg"
import man_laptop from "../../assets/man_laptop.svg"
import { useNavigate } from 'react-router-dom';
 
const Carousel = () => {

  const navigate = useNavigate();

  return (
    <div className="home-content">
      <Explore/>
      <marquee behavior="alternate" direction="left">
        <span className="star">★</span>OFFICE GIFTS
        <span className="star">★</span>PENS
        <span className="star">★</span>DAIRY BOOKS
        <span className="star">★</span>BOTTLES
        <span className="star">★</span>3D PRINTING MODELS
        <span className="star">★</span>MOBILE STAND
        <span className="star">★</span>KEYCHAINS
        <span className="star">★</span>PEN STAND
        <span className="star">★</span>BONSAI PLANTS
      </marquee>
      <div className="home-container">
        <div className='wardrobe'>
          <div className='wardrobe-img'>
            <img src={om} alt="om" />
          </div>
          <div className='wardrobe-text'>
            <h1>Upgrade Your Wardrobe with Our Exclusive</h1>
            <h1>T-Shirts.</h1>
            <p>Customize Explore and Shop Now!</p>
            <button>SHOP NOW</button>
          </div>
        </div>
        <div className='badge'>
          <h1>Your Design,</h1>
          <h1>Your Badge</h1>
          <h1>PERSONALIZE IT!</h1>
          <button>EXPLORE</button>
          <img src={badge} alt="" />
        </div>
      </div>
      <div className="banner">
        <span className='text'>
          <h1>DEV CREATIONS</h1>
          <hr/>
          <h4>A N D&nbsp; S O L U T I O N S</h4>
          <p>YOUR VISION IS OUR  CREATIONS</p>
          <p>Creative branding solutions for businesses, delivering everything needed to make a lasting impression.</p>
        </span>
        <img src={Women_banner} alt="" />
      </div>
      <div className="explore">
        <h1>Explore Our Collection</h1>
        <hr />
        <h4>Browse through our products</h4>
        <div className="explore-container">
          <div className="explore-card">
            <h3>Gift mugs</h3>
            <img src={mug} alt="Gift mugs" />
          </div>
          <div className="explore-card">
            <h3>Pens</h3>
            <img src={pens} alt="Pens" /> 
          </div>
          <div className="explore-card">
            <h3>Key chains</h3>
            <img src={keychains} alt="Key chains" /> 
          </div>
          <div className="explore-card">
            <h3>Personal dairy</h3>
            <img src={dairy} alt="Personal dairy" /> 
          </div>
          <div className="explore-card">
            <h3>Mobile stand</h3>
            <img src={mobilestand} alt="Mobile stand" /> 
          </div>
          <div className="explore-card">
            <h3>Pen stand</h3>
            <img src={penstand} alt="Pen stand" /> 
          </div>
        </div>
        <button onClick={()=>navigate("/products")}>EXPLORE MORE</button>
      </div>
      <div className="promo">
        <span className="promo-text">
          <h1>Unlock your creativity with our professional courses</h1>
          <p>Unlock your potential with expertly designed courses at Dev Creations. Master Graphic Design, 3D Animation, or Audio-Video Editing using industry-standard tools like Photoshop, Maya, and Premiere Pro. Turn creativity into career-ready skills with guidance from professionals!</p>
          <button>EXPLORE</button>
        </span>
        <span className="promo-img">
          <img src={man_laptop} alt="" />
        </span>
      </div>
    </div>
  );
};

export default Carousel;
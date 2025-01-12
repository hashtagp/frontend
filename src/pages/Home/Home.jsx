import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import './Home.css';
import mug from "../../assets/mug-home.png";
import pens from "../../assets/pens-home.png";
import keychains from "../../assets/keychains-home.png";
import dairy from "../../assets/dairy-home.png";
import mobile_stand from "../../assets/phone-stand-home.png";
import pen_stand from "../../assets/pen-stand-home.png";
import gift_plant from "../../assets/plants-home.png";
import bottle_home from "../../assets/bottle-home.png";
import Explore from '../../components/Explore';
import om from "../../assets/om.svg";
import badge from "../../assets/badge.png";
import Women_banner from "../../assets/Women_banner.svg";
import explore_tWoman from "../../assets/explore_tWoman.svg";
import explore_badge from "../../assets/explore_badge.svg";
import explore_letterhead from "../../assets/explore_letterhead.svg";
import explore_banner from "../../assets/explore_banner.svg";
import explore_calender from "../../assets/explore_calender.svg";
import explore_certificate from "../../assets/explore_certificate.svg";
import man_laptop from "../../assets/man_laptop.svg";
import essentials_hamper from "../../assets/essentials-hampers.png";
import writing_hampers from "../../assets/writing-hampers.png";
import drinkset_hampers from "../../assets/drinkset-hampers.png";
import banner_homepage from "../../assets/banner-homepage.png";

const Carousel = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="home-content">
        <Explore />
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
          <h1>
            Featured <span style={{ color: "#FF6600" }}>Collections</span>
          </h1>
          <p>Handpicked Hampers & Gifts: Perfect for Every Occasion</p>
          <div className="hampers">
            <div className="hampers-left">
              <img src={essentials_hamper} alt="Essentials Hamper" />
            </div>
            <div className="hampers-right">
              <div>
                <img src={writing_hampers} alt="Writing Hampers" />
              </div>
              <div>
                <img src={drinkset_hampers} alt="Drinkset Hampers" />
              </div>
            </div>
         </div>
        </div>        

      <div className="banner">
        {/* <span className="text">
          <h1>DEV CREATIONS</h1>
          <hr />
          <h4>A N D&nbsp; S O L U T I O N S</h4>
          <p>YOUR VISION IS OUR CREATIONS</p>
          <p>
            Creative branding solutions for businesses, delivering everything
            needed to make a lasting impression.
          </p>
        </span> */}
        <img src={banner_homepage} alt="Sale Banner" />
      </div>

      <div className="explore">
        <h1>Explore Our Collection</h1>
        <h4>Browse through our products</h4>
        <div className="explore-container">
          <div className="explore-card">
            <img
              onClick={() => navigate("/products?category=Mug")}
              src={mug}
              alt="Gift mugs"
            />
            <h3>Gift mugs</h3>
          </div>
          <div className="explore-card">
            <img
              onClick={() => navigate("/products?category=Pens")}
              src={pens}
              alt="Pens"
            />
            <h3>Pens</h3>
          </div>
          <div className="explore-card">
            <img
              onClick={() => navigate("/products?category=Keychains")}
              src={keychains}
              alt="Key chains"
            />
            <h3>Key chains</h3>
          </div>
          <div className="explore-card">
            <img
              onClick={() => navigate("/products?category=Diary")}
              src={dairy}
              alt="Personal dairy"
            />
            <h3>Personal dairy</h3>
          </div>
          <div className="explore-card">
            <img
              onClick={() => navigate("/products?category=Mobile-stand")}
              src={mobile_stand}
              alt="Mobile stand"
            />
            <h3>Mobile stand</h3>
          </div>
          <div className="explore-card">
            <img
              onClick={() => navigate("/products?category=Pen-stand")}
              src={pen_stand}
              alt="Pen stand"
            />
            <h3>Pen stand</h3>
          </div>
          <div className="explore-card">
            <img
              onClick={() => navigate("/products?category=Bonsai-plant")}
              src={gift_plant}
              alt="gift_plant"
            />
            <h3>Gift plant</h3>
          </div>
          <div className="explore-card">
            <img
              onClick={() => navigate("/products?category=Bottle")}
              src={bottle_home}
              alt="bottle_home"
            />
            <h3>Bottle</h3>
          </div>
        </div>
        <button onClick={() => navigate("/products")}>EXPLORE MORE</button>
      </div>

      <div className="promo">
        <span className="promo-text">
          <h1>Unlock your creativity with our professional courses</h1>
          <p>
            Unlock your potential with expertly designed courses at Dev
            Creations. Master Graphic Design, 3D Animation, or Audio-Video
            Editing using industry-standard tools like Photoshop, Maya, and
            Premiere Pro. Turn creativity into career-ready skills with guidance
            from professionals!
          </p>
          <button>EXPLORE</button>
        </span>
        <span className="promo-img">
          <img src={man_laptop} alt="" />
        </span>
      </div>
    </div>
    </>
  );
};

export default Carousel;

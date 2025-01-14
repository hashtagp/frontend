import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import './Home.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import mug from "../../assets/mug-home.png";
import pens from "../../assets/pens-home.png";
import keychains from "../../assets/keychains-home.png";
import dairy from "../../assets/dairy-home.png";
import mobile_stand from "../../assets/phone-stand-home.png";
import pen_stand from "../../assets/pen-stand-home.png";
import gift_plant from "../../assets/plants-home.png";
import bottle_home from "../../assets/bottle-home.png";
import bamboo_home from "../../assets/bamboo-home.png";
import monstera_home from "../../assets/monstera-home.png";
import jade_home from "../../assets/jade-home.png";
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
  const [banner, setBanner] = useState({});
  const [menu, setMenu] = useState("All");

  const { url } = useContext(StoreContext);

  const range = [
    {image: pens, name: "Pens", category: "Pens"},
    {image: dairy, name: "Diary", category: "Diary"},
    {image: pen_stand, name: "Pen stand", category: "Pen-stand"},
    {image: bottle_home, name: "Bottle", category: "Bottle"},
    {image: keychains, name: "Keychains", category: "Keychains"},
    {image: mobile_stand, name: "Mobile stand", category: "Mobile-stand"},
    {image: mug, name: "Gift mugs", category: "Mug"},
    {image: gift_plant, name: "Gift plant", category: "Bonsai-plant"},
    {image: bamboo_home, name: "Bamboo plant", category: "Bamboo-plant"},
    {image: monstera_home, name: "Monstera plant", category: "Monstera-plant"},
    {image: jade_home, name: "Jade plant", category: "Jade-plant"},
  ]

  const fetchBanner = async () => {
    try {
      const response = await axios.get(`${url}/api/users/get/banner`);
      console.log(response.data.data);
      setBanner(response.data.data);
    } catch (error) {
      console.error('Error fetching banner:', error);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

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
        <img src={banner.image} alt={banner.name} />
      </div>

      <div className="explore">
        <h1>Explore Our <span style={{ color: "#FF6600" }}>Range</span></h1>
        <h4>Browse through our products</h4>
        <div className="explore-product-categories">
            <button className={`explore-category ${menu==="All"?"active":null}`} onClick={()=> setMenu("All")}>Best Sellers</button>
            <button className={`explore-category ${menu==="Plant"?"active":null}`} onClick={()=> setMenu("Plant")}>Plants</button>
            <button className={`explore-category ${menu==="Work Essentials"?"active":null}`} onClick={()=> setMenu("Work Essentials")}>Work Essentials</button>
        </div>
        <div className="explore-container">
          {range.map((item, index) => { 
            if(menu === "All"){
              if(index < 8){
              return (
                <div key={index} className="explore-card">
                  <img
                    onClick={() => navigate(`/products?category=${item.category}`)}
                    src={item.image}
                    alt={item.name}
                  />
                  <h3>{item.name}</h3>
                </div>
              )
              }
            } else if(menu === "Plant"){
              if(index > 6){
                return (
                  <div key={index} className="explore-card">
                    <img
                      onClick={() => navigate(`/products?category=${item.category}`)}
                      src={item.image}
                      alt={item.name}
                    />
                    <h3>{item.name}</h3>
                  </div>
                )
              }
            } else if(menu === "Work Essentials"){
              if(index < 4){
                return (
                  <div key={index} className="explore-card">
                    <img
                      onClick={() => navigate(`/products?category=${item.category}`)}
                      src={item.image}
                      alt={item.name}
                    />
                    <h3>{item.name}</h3>
                  </div>
                )
              }
            }
          }
          )}
          </div>
        <button onClick={() => navigate("/products")}>EXPLORE MORE</button>
      </div>
    </div>
    </>
  );
};

export default Carousel;
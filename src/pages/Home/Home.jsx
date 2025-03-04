import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import mug from "../../assets/mug-home.jpg";
import pens from "../../assets/pens-home.jpg";
import keychains from "../../assets/keychains-home.jpg";
import dairy from "../../assets/dairy-home.jpg";
import mobile_stand from "../../assets/phone-stand-home.jpg";
import pen_stand from "../../assets/pen-stand-home.jpg";
import gift_plant from "../../assets/plants-home.jpg";
import bottle_home from "../../assets/bottle-home.jpg";
import bamboo_home from "../../assets/bamboo-home.png";
import monstera_home from "../../assets/monstera-home.png";
import jade_home from "../../assets/jade-home.png";
import Explore from '../../components/Explore';
import essentials_hamper from "../../assets/essentials-hampers.png";
import writing_hampers from "../../assets/writing-hampers.png";
import drinkset_hampers from "../../assets/drinkset-hampers.png";
import Combo2 from "../../assets/Combo-2.png";
import Combo3 from "../../assets/Combo-3.png";
import Combo4 from "../../assets/Combo-4.png";
import Combo6 from "../../assets/Combo-6.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {
  const navigate = useNavigate();
  const [banner, setBanner] = useState([]);
  const [menu, setMenu] = useState("All");

  const { url } = useContext(StoreContext);

  const range = [
    { image: pens, name: "Pens", category: "Pens" },
    { image: dairy, name: "Diary", category: "Diary" },
    { image: pen_stand, name: "Pen stand", category: "Pen-stand" },
    { image: bottle_home, name: "Bottle", category: "Bottle" },
    { image: keychains, name: "Keychains", category: "Keychains" },
    { image: mobile_stand, name: "Mobile stand", category: "Mobile-stand" },
    { image: mug, name: "Gift mugs", category: "Mug" },
    { image: gift_plant, name: "Gift plant", category: "Bonsai-plant" },
    { image: bamboo_home, name: "Bamboo plant", category: "Bamboo-plant" },
    { image: monstera_home, name: "Monstera plant", category: "Monstera-plant" },
    { image: jade_home, name: "Jade plant", category: "Jade-plant" },
  ];

  const reviews = [
    { name: "Sanjana", review: "This pen has an elegant and timeless design, making it an excellent gift for professionals or students.The smooth writing experience adds to its charm, and the premium feel makes it a standout gift for special occasions like graduations",color: "F2B980", border: "F68B20", stars: 3 },
    { name: "Bhumika", review: "Stylish yet functional, this keychain is both a practical and thoughtful gift. The sturdy build ensures it lasts, while the sleek design adds a touch of elegance. Perfect for gifting as a small token of appreciation or for personalized touches with initials or engravings.", color: "C5F6FF", border: "629AA4", stars: 4 },
    { name: "Nikhil", review: "This pen stand is a great addition to any desk, adding a touch of sophistication and organization. The sleek design and sturdy build make it a perfect gift for professionals or students.", color: "F2CBE7", border: "C36C77", stars: 3 },
  ];

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

  const renderStars = (stars) => {
    return Array(stars).fill('★').join('');
  };

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
        <Carousel 
        autoPlay 
        interval={5000} 
        infiniteLoop 
        showThumbs={false} 
        showStatus={false} // Hides the "1 of 2" indicator
        swipeable
        >
          {banner.length === 0 ? (
            null
          ) : (
          banner.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt={item.name} />
          </div>
          ))
          )}
        </Carousel>
        </div>

        <div className="explore">
          <h1>
            Explore Our <span style={{ color: "#FF6600" }}>Range</span>
          </h1>
          <h4>Browse through our products</h4>
          <div className="explore-product-categories">
            <button className={`explore-category ${menu === "All" ? "active" : null}`} onClick={() => setMenu("All")}>
              Best Sellers
            </button>
            <button className={`explore-category ${menu === "Plant" ? "active" : null}`} onClick={() => setMenu("Plant")}>
              Plants
            </button>
            <button className={`explore-category ${menu === "Work Essentials" ? "active" : null}`} onClick={() => setMenu("Work Essentials")}>
              Work Essentials
            </button>
          </div>
          <div className="explore-container">
            {range.map((item, index) => {
              if (menu === "All" && index < 8) {
                return (
                  <div key={index} className="explore-card">
                    <img onClick={() => navigate(`/products?category=${item.category}`)} src={item.image} alt={item.name} />
                    <h3>{item.name}</h3>
                  </div>
                );
              } else if (menu === "Plant" && index > 6) {
                return (
                  <div key={index} className="explore-card">
                    <img onClick={() => navigate(`/products?category=${item.category}`)} src={item.image} alt={item.name} />
                    <h3>{item.name}</h3>
                  </div>
                );
              } else if (menu === "Work Essentials" && index < 4) {
                return (
                  <div key={index} className="explore-card">
                    <img onClick={() => navigate(`/products?category=${item.category}`)} src={item.image} alt={item.name} />
                    <h3>{item.name}</h3>
                  </div>
                );
              }
            })}
          </div>

          {/* Gift Hampers Section */}
          <div className="gift-hampers">
            <h2>Gift <span style={{ color: "#FF6600" }}>Hampers</span></h2>
            <h4>Perfect combinations for every occasion</h4>
            <div className="hampers-container">
              <div className="hamper-card" onClick={() => navigate('/products?category=Combo-2')}>
                <div className="hamper-image-container">
                  <img src={Combo2} alt="Duo Combo" />
                </div>
                <h3>Duo Combo</h3>
                <p>Perfect pair of complementary items</p>
              </div>
              
              <div className="hamper-card" onClick={() => navigate('/products?category=Combo-3')}>
                <div className="hamper-image-container">
                  <img src={Combo3} alt="Triple Treat" />
                </div>
                <h3>Triple Treat</h3>
                <p>Our most popular 3-item gift set</p>
              </div>
              
              <div className="hamper-card" onClick={() => navigate('/products?category=Combo-4')}>
                <div className="hamper-image-container">
                  <img src={Combo4} alt="Quad Collection" />
                </div>
                <h3>Quad Collection</h3>
                <p>Premium 4-piece gift hamper</p>
              </div>
              
              <div className="hamper-card" onClick={() => navigate('/products?category=Combo-6')}>
                <div className="hamper-image-container">
                  <img src={Combo6} alt="Luxury Bundle" />
                </div>
                <h3>Luxury Bundle</h3>
                <p>Complete 5-item gift experience</p>
              </div>
            </div>
          </div>

          <button onClick={() => navigate("/products")}>EXPLORE MORE</button>
        </div>

        <div className="customer-reviews">
        <h1>
            Customer <span style={{ color: "#FF6600" }}>Reviews</span>
          </h1>
          <h4>Hear what our customers have to say</h4>
          <hr/>
          <div className="reviews-list">
            {reviews.map((item, index) => (
              <div
                key={index}
                className="reviews-card"
                style={{
                  backgroundColor: `rgba(${parseInt(item.color.slice(0, 2), 16)}, ${parseInt(item.color.slice(2, 4), 16)}, ${parseInt(item.color.slice(4, 6), 16)}, 0.2)`, // Use RGBA with low alpha for transparency
                  opacity: "1", // Ensure opacity of text and content remains 100% visible
                  border : `2px solid #${item.border}`
                }}
              >
                <h4>{item.name}</h4>
                <p>{item.review}</p>
                <div className="stars">
                  {renderStars(item.stars)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

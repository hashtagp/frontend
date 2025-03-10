import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import devLogo2 from "../assets/logo.svg";
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import axios from "axios";
import { debounce, set } from 'lodash';
import nav_mobile_logo from "../assets/nav_mobile_logo.svg";
import profile from "../assets/profile.svg";
import cart from "../assets/cart.svg";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [menu, setMenu] = useState("");
  const { url, getTotalCartValue } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => { 
    const path = location.pathname.split('/')[1];
    setMenu(path);
  }, [location]);

  const handleMenuClick = (menu) => {
    setMenu(menu);
    navigate(`/${menu.toLowerCase()}`);
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    } else {
      navigate('/signup');
    }
  };

  const debouncedSearch = debounce(async (query) => {
    try {
      const response = await axios.get(`${url}/api/products/search`, { params: { query } });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }, 300);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) debouncedSearch(query);
    else setSearchResults([]);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">

          {/* Logo */}
          <div className="logo nav-desktop-logo">
            <a href="/" onClick={() => setSearchResults([])}>
              <img src={devLogo2} alt="Dev Creations Logo" />
            </a>
          </div>

          {/* Mobile Logo */}
          <div className="logo nav-mobile-logo">
            <a href="/" onClick={() => setSearchResults([])}>
              <img src={nav_mobile_logo} alt="Dev Creations Logo" />
            </a>
          </div>

          <div className="nav-options">
          {/* Search Bar */}
          <div className="search-bar w-[20rem]">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            {searchQuery && searchResults.length > 0 && (
              <div className="search-results">
                <ul>
                  {searchResults.map((result) => (
                    <li key={result._id} onClick={() => handleProductClick(result._id)}>
                      {result.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <div className="one py-25 font-medium hidden sm:block">
            <ul className="nav-links">
              <li onClick={() => handleMenuClick("")} className={menu === "" ? "active" : null}>Home</li>
              <li onClick={() => handleMenuClick("products")} className={menu === "products" ? "active" : null}>Shop</li>
              <li onClick={() => handleMenuClick("contact")} className={menu === "contact" ? "active" : null}>Contact</li>
            </ul>
          </div>


          {/* Nav Icons */}
          <div className="nav-icons">
            <a href="#" className="icon cart" onClick={() => navigate("/cart")}>
              <img src={cart} alt="cart" />
              {getTotalCartValue() > 0 && <span className="cart-notification-dot"></span>}
            </a>
            <a href="#" onClick={handleProfileClick} className="icon profile">
            <img src={profile} alt="profile" />
            </a>
          </div>

          {/* Mobile Nav Links (Hamburger Menu) */}
          <div className="menu-icon">
            <button onClick={toggleMenu} className="hamburger-menu">
              {isMobileMenuOpen ? "X" : "☰"} {/* Toggle between Hamburger and Close */}
            </button>
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
              <ul>
                <li><a href="#" onClick={() => { toggleMenu(); handleMenuClick("") }} className={menu === "" ? "active" : null}>Home</a></li>
                <li><a href="#" onClick={() => { toggleMenu(); handleMenuClick("Products") }} className={menu === "Products" ? "active" : null}>Shop</a></li>
                <li><a href="#" onClick={() => { toggleMenu(); handleMenuClick("Contact") }} className={menu === "Contact" ? "active" : null}>Contact</a></li>
              </ul>
            </div>
          </div>
          </div>
        </div>
      </nav>
      <div className="search-mobile w-[20rem]">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            {searchQuery && searchResults.length > 0 && (
              <div className="search-results">
                <ul>
                  {searchResults.map((result) => (
                    <li key={result._id} onClick={() => handleProductClick(result._id)}>
                      {result.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
    </div>
  );
};

export default Navbar;

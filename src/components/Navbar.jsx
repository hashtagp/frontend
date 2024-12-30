import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import devLogo2 from "../assets/logo.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import axios from "axios";
import { debounce, set } from 'lodash';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [menu, setMenu] = useState("");
  const { url } = useContext(StoreContext);

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

          {/* Desktop Nav Links */}
          <div className="one py-25 font-medium hidden sm:block">
            <ul className="nav-links">
              <li onClick={() => handleMenuClick("")} className={menu === "" ? "active" : null}>Home</li>
              <li onClick={() => handleMenuClick("products")} className={menu === "products" ? "active" : null}>Shop</li>
              <li onClick={() => handleMenuClick("contact")} className={menu === "contact" ? "active" : null}>Contact</li>
            </ul>
          </div>

          {/* Mobile Nav Links (Hamburger Menu) */}
          <div className="sm:hidden">
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

          {/* Logo */}
          <div className="logo">
            <a href="/" onClick={() => setSearchResults([])}>
              <img src={devLogo2} alt="Dev Creations Logo" />
            </a>
          </div>

          {/* Search Bar */}
          <div className="search-bar w-[15rem] hidden sm:block">
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

          {/* Nav Icons */}
          <div className="nav-icons">
            <a href="#" className="icon cart" onClick={() => navigate("/cart")}>🛒</a>
            <a href="#" onClick={handleProfileClick} className="icon profile">👤</a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

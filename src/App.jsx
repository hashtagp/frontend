import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { StoreContext } from "./context/StoreContext";
import './App.css';
import Navbar from './components/Navbar.jsx';
import Signup from './pages/Signup/Signup.jsx';
import Payment from "./pages/Payment/Payment.jsx";
import Home from "./pages/Home/Home.jsx";
import Footer from "./components/Footer.jsx";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Products from "./components/Products.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import FAQ from "./pages/FAQ/FAQ.jsx";
import TermsAndConditions from "./pages/TnC/TnC.jsx";
import Package from "./pages/Package/package.jsx";
import Profile from "./pages/Profile/profile.jsx";
import AboutUs from "./pages/about us/aboutus.jsx";
import Verify from "./pages/verify/verify.jsx";
import MyOrders from "./pages/MyOrders/MyOrders.jsx";
import PlaceOrder from "./pages/placeOrder/placeOrder.jsx";
import CartPage from "./pages/Cart/cart.jsx";
import ReturnPolicy from "./pages/ReturnPolicy/ReturnPolicy.jsx";
import Product from "./components/Product.jsx";
import { ToastContainer } from 'react-toastify';

//admin components
import AdminLoginSignup from "../src/admin/pages/Login/AdminLoginSignup.jsx";
import Add from "../src/admin/pages/Add/Add.jsx";
import List from "../src/admin/pages/List/List.jsx";
import Orders from "../src/admin/pages/Orders/Orders.jsx";
import Sidebar from "../src/admin/components/Sidebar/Sidebar.jsx";
import AdminNavbar from "../src/admin/components/Navbar/AdminNavbar.jsx";
import Dashboard from "../src/admin/pages/Dashboard/Dashboard.jsx";

function App() {
  const { token } = useContext(StoreContext); // Use the token from context
  const location = useLocation(); // Get the current location

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (location.pathname === "/admin" && token) {
      const tokenDeleted = localStorage.getItem("tokenDeleted");
      if (!tokenDeleted) {
        localStorage.removeItem("token");
        localStorage.setItem("tokenDeleted", "true");
      }
    }
  }, [location.pathname, token]);

  if (isAdminRoute) {
    return (
      <div className="app-admin">
        <AdminNavbar />
        <div className="admin-content">
          <Sidebar />
          <Routes>
            <Route path="/admin/add" element={<Add />} />
            <Route path="/admin/list" element={<List />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
        </div>
        {token ? null : <AdminLoginSignup />}
      </div>
    );
  } else {
    return (
      <div className="app">
        <Navbar />
        <ToastContainer />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/package/:orderId" element={<Package />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/myOrders" element={<MyOrders />} />
            <Route path="/placeOrder" element={<PlaceOrder />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
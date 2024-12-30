import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import profile_icon from '../../assets/profile_icon.png';

const Profile = () => {
  const [user, setUser] = useState({});
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      console.log("Token:", token);
      if (!token) {
        navigate('/login');
      } else {
        try {
          console.log("Fetching profile...");
          let response = await axios.get(url + "/api/users/profile", { headers: { Authorization: `Bearer ${token}` } });
          if (response.data.success) {
            setUser(response.data.user);
            console.log("User:", response.data.user);
            console.log("Profile fetched successfully.");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    }
    fetchData();
  }, [navigate, url]);

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <main className="profile mx-auto py-8 px-6 max-w-5xl">
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Profile Section */}
          <div className="bg-blue-300 shadow-md rounded-lg p-6 flex flex-col items-center w-full lg:w-1/3">
            <img src={profile_icon} alt="User Profile" className="rounded-full w-24 h-24 mb-4" />
            <h2 className="text-lg font-semibold">{user.username}</h2>
            <p className="text-gray-900">{user.email}</p>
          </div>

          {/* Action Buttons Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-2/3">
            <button className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium py-8 px-8 text-center rounded-md shadow-md transition duration-300" onClick={() => navigate("/myOrders")}>Your Orders</button>
            <button className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium py-8 px-8 text-center rounded-md shadow-md transition duration-300">Track Your Order</button>
            <button className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium py-8 px-8 text-center rounded-md shadow-md transition duration-300" onClick={() => navigate("/myOrders")}>Purchase History</button>
            <a href="/contact" className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium py-8 px-8 text-center rounded-md shadow-md transition duration-300">Contact Us</a>
            <a href="/contact" className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium py-8 px-8 text-center rounded-md shadow-md transition duration-300" onClick={() => logoutHandler()}>Logout</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
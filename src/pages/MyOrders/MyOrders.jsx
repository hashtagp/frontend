import React, { useContext, useEffect, useState } from 'react';
import "./MyOrders.css";
import { StoreContext } from '../../context/StoreContext';
import parcel_icon from "../../assets/parcel_icon.png";
import empty_cart from "../../assets/empty_cart.png";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { myProp } = location.state || {};

  useEffect(() => {
    if (myProp) {
      toast.success("Order placed!!");
    }
  }, [myProp]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { Authorization: `Bearer ${token}` } });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>Your Orders</h2>
      <div className="my-orders-container">
        {data && data.length > 0 ? (
          data.slice().reverse().map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={parcel_icon} alt="Parcel Icon" />
              <p>{order.items.map((item, index) => (
                <p key={index}>{item.name + " X " + item.quantity}</p>
              ))}</p>
              <p>&#8377;{order.totalAmount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span><b>{order.status}</b></p>
              {order.payment?.status ? (
                <button onClick={() => navigate(`/package/${order._id}`)}>Track order</button>
              ) : (
                <button>Payment failed</button>
              )}
            </div>
          ))
        ) : (
          <div className='no-orders'>
            <img src={empty_cart} alt="Empty Cart" />
            <p>No orders found..!!</p>
            <button onClick={() => navigate("/products")}>View Products</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

import React, { useContext, useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/admin_assets/assets";
import { StoreContext } from "../../../context/StoreContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { url, token } = useContext(StoreContext);

  const fetchAllOrders = async (date) => {
    if (!token) {
      toast.error("Authorization token is missing");
      return;
    }
    try {
      const formattedDate = date ? date.toISOString().split('T')[0] : null;
      const response = await axios.get(`${url}/api/admin/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: formattedDate, filter: "daily" },
      });
      if (response.data.success && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
        console.log("Orders fetched:", response.data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    console.log(event.target.value)
    try {
      const response = await axios.put(
        `${url}/api/admin/orders/update`,
        {
          orderId,
          status: event.target.value,
          date: Date.now()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update request sent");
      if (response.data.success) {
        await fetchAllOrders(selectedDate);
        toast.success("Order status updated");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    if (token && url) {
      fetchAllOrders(selectedDate);
    }
  }, [token, url, selectedDate]);

  // Function to determine the available options for status based on dates
  const getStatusOptions = (order) => {
    if (order.deliveredDate) {
      return (
        <p
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "5px 5px",
            borderRadius: "5px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "10px auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Order Delivered
        </p>
      );      
    }
    if (order.shippedDate) {
      return (
        <select
          onChange={(event) => statusHandler(event, order._id)}
          value={order.status}
        >
          <option value="status">status</option>
          <option value="delivered">Delivered</option>
        </select>
      ); // If shipped, show only "Delivered"
    }
    if (order.orderDate) {
      return (
        <select
          onChange={(event) => statusHandler(event, order._id)}
          value={order.status}
        >
          <option value="status">status</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      ); // If ordered, show "Shipped" and "Delivered"
    }
    return null; // If no dates, return nothing
  };

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="date-picker-container">
        <label className="Choice">Select Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
    {orders.length > 0 ? (
      <div className="order-list">
        {orders.slice().reverse().map((order, index) => (
          <div key={order._id || index} className="order-item">
            <img src={assets.parcel_icon} alt="Order Parcel Icon" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}
                    {idx !== order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="order-item-name">
                {order.address?.firstName || "N/A"}{" "}
                {order.address?.lastName || ""}
              </p>
              <div className="order-item-address">
                <p>{order.address?.street || "N/A"},</p>
                <p>{order.address?.city || "N/A"}</p>
              </div>
              <div className="order-item-address">
              <p>{order.address?.state || "N/A"}</p>
              <p>{order.address?.postalCode || "N/A"}</p>
              </div>
              <p className="order-item-phone">{order.address?.phone || "N/A"}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>&#8377;{order.totalAmount}</p>
            <p>
              Payment:{" "}
              {order.payment?.status
                ? `Paid (${order.payment.method})`
                : "Failed"}
            </p>
            <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            {order.payment?.status && (
              <>
                {order.estimatedDate && (
                  <p>
                    Estimated Delivery:{" "}
                    {new Date(order.estimatedDate).toLocaleDateString()}
                  </p>
                )}
                {order.shippedDate && (
                  <p>Shipped Date: {new Date(order.shippedDate).toLocaleDateString()}</p>
                )}
                {order.deliveredDate && (
                  <p>
                    Delivered Date: {new Date(order.deliveredDate).toLocaleDateString()}
                  </p>
                )}
                {getStatusOptions(order)}
              </>
            )}
            {!order.payment?.status && <p style={{
            backgroundColor: "red",
            color: "white",
            padding: "5px 5px",
            borderRadius: "5px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "10px auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}>Order Failed</p>}
          </div>
        ))}
      </div>
    ) : (
      <p>No orders found</p>
    )}  
    </div>
  );
};

export default Orders;
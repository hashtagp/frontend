import React, { useContext, useState, useEffect } from 'react';
import './placeOrder.css';
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartValue, value, token, item_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: ""
  });

  const calculateSalesTax = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = cartItems[itemId];
      console.log("Calculating sales tax for item:", item.gst * item.quantity);
      return total + (item.gst * item.quantity);
    }, 0);
  };

  const salesTax = calculateSalesTax();
  const shippingCharge = 100;

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    console.log("Cart Items:", cartItems);
    console.log("Item List:", item_list);
    item_list.forEach((item) => {
      if (cartItems[item._id] && cartItems[item._id].quantity > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id].quantity };
        orderItems.push(itemInfo);
      }
    });
    console.log("Order Items:", orderItems);
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartValue()+shippingCharge+salesTax,
    };
    let response = await axios.post(url + "/api/order/place", orderData, { headers: { Authorization: `Bearer ${token}` } });
    if (response.data.success) {
      const { newOrderId, orderId, amount, key } = response.data;

      const options = {
        key: key,
        amount: amount * 100,
        currency: "INR",
        name: "Dev Creations & Solutions",
        description: "Order Payment",
        order_id: orderId,
        handler: function (response) {
          // Payment success handler
          window.location.href = `/verify?success=true&orderId=${newOrderId}`;
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error("Razorpay SDK not loaded.");
      }
    } else {
      alert("Error in processing the order");
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (token === "" || value) {
      return;
    }
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartValue() === 0) {
      navigate('/cart');
    }
  }, [token, value, getTotalCartValue, navigate]);

  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
        <h2>Delivery Info</h2>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>
        <label>Street</label>
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <label>Postal Code</label>
        <input required name="postalCode" onChange={onChangeHandler} value={data.postalCode} type="text" placeholder="Postal Code" />
        <label>Phone</label>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="tel" pattern="[6-9]{1}[0-9]{9}" placeholder="Phone" />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details flex justify-between py-2">
              <span>Subtotal</span>
              <span>&#8377;{getTotalCartValue()}</span>
            </div>
            <hr />
            <div className="cart-total-details flex justify-between py-2">
              <span>Shipping</span>
              <span>&#8377;{shippingCharge}</span>
            </div>
            <div className="cart-total-details flex justify-between py-2">
              <span>Sales Tax</span>
              <span>&#8377;{salesTax}</span>
            </div>
            <hr />
            <div className="cart-total-details mt-2 flex justify-between py-2">
              <b>Total</b>
              <b>&#8377;{getTotalCartValue()+shippingCharge+salesTax}</b>
            </div>
          </div>
          <button type="submit">Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

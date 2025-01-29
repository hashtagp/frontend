import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const Package = () => {
  const { token, url } = useContext(StoreContext);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);
  const { orderId } = useParams();
  const [shippingCharge, setShippingCharge] = useState(100);
  const [salesTax, setSalesTax] = useState(0);

  useEffect(() => {
    if (token === "") {
      return;
    }
    const fetchOrder = async () => {
      try {
        console.log("Fetching order:", orderId);
        console.log("Token:", token);
        const response = await axios.get(`${url}/api/orders/track`, {
          params: { orderId },
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(response.data);
        const calculatedSalesTax = response.data.items.reduce((total, item) => {
          return total + (item.gst * item.quantity);
        }, 0);
        setSalesTax(calculatedSalesTax);
        console.log("Order fetched:", response.data);
      } catch (error) {
        console.log("Error fetching order:", error);
        setError(true);
      }
    };
  
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, token, url]);

  const getStatusClass = (status) => {
    if (status === 'Confirmed') return 'bg-orange-500';
    if (status === 'Shipped') return 'bg-orange-500';
    if (status === 'Delivered') return 'bg-orange-500';
    return 'bg-gray-300';
  };

  const getLineWidth = () => {
    if (order.deliveredDate) return '100%';
    if (order.shippedDate) return '66%';
    return '33%';
  };

  if (error) {
    return (
      <div className='loading'>
          <div className="error text-center text-red-500 text-2xl font-bold">Failed to load order. Please try again.</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='loading'>
          <div className="spinner">
          </div>
      </div>
    );
  }

  return (
    <div className="package mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">TRACK YOUR PACKAGE</h1>
      <p className="text-gray-600 mb-4">Estimated Delivery: <span className="font-bold">{order.estimatedDate ? new Date(order.estimatedDate).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            }) : "TBD"}</span></p>

      <div className="bg-white-200 p-4 rounded-lg shadow-md mb-8 border-t-4 border-gray-300">
        <div className="relative flex justify-between items-center">
          <div className="absolute top-4 h-1 bg-orange-500" style={{ width: getLineWidth() }}></div>
          <div className="flex-1 text-center">
            <div className={`w-8 h-8 mx-auto rounded-full ${getStatusClass('Confirmed')}`}></div>
            <p className="mt-2 text-sm font-semibold">Ordered</p>
            <p className="text-xs text-gray-500">{order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            }) : "Tue, 10 June"}</p>
          </div>
          <div className="flex-1 text-center">
            {order.shippedDate ? <div className={`w-8 h-8 mx-auto rounded-full ${getStatusClass('Shipped')}`}></div> : <div className="w-8 h-8 mx-auto rounded-full bg-gray-300"></div>}
            <p className="mt-2 text-sm font-semibold">Shipped</p>
            <p className="text-xs text-gray-500">{order.shippedDate ? new Date(order.shippedDate).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            }) : null}</p>
          </div>
          <div className="flex-1 text-center">
            {order.deliveredDate ? <div className={`w-8 h-8 mx-auto rounded-full ${getStatusClass('Delivered')}`}></div> : <div className="w-8 h-8 mx-auto rounded-full bg-gray-300"></div>}
            <p className="mt-2 text-sm font-semibold">Delivered</p>
            <p className="text-xs text-gray-500">{order.deliveredDate ? new Date(order.deliveredDate).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            }) : null}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 bg-white-200 p-6 rounded-lg shadow-md border-t-4 border-gray-300">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          <div id="cart-items" className="space-y-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex flex-wrap items-center justify-between border-b pb-4 bg-white-200 rounded-lg p-4 sm:flex-row flex-col">
                <img src={item.image || "default-image-url"} alt={item.name || "Product Image"} className="w-48 h-48 rounded-lg object-cover" />
                <div className="flex-1 ml-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  {/* Optionally display item size/color */}
                  {/* <p className="text-sm text-gray-800">SIZE: {item.size}</p>
                  <p className="text-sm text-gray-800">COLOUR: {item.color}</p> */}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Rs {item.price}</span>
                  <div className="flex items-center border rounded">
                    {/* <button className="px-2 py-1 text-gray-600" onClick={() => updateQuantity(-1, item.price, index)}>-</button> */}
                    <input id={`quantity-${index}`} type="text" value={`x ${item.quantity}`} className="w-8 text-center border-l border-r" readOnly />
                    {/* <button className="px-2 py-1 text-gray-600" onClick={() => updateQuantity(1, item.price, index)}>+</button> */}
                  </div>
                  <span id={`total-${index}`} className="font-medium">Rs {item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-white-200 p-6 rounded-lg shadow-md border-t-4 border-gray-300">
        <h2 className="text-xl font-bold mb-4">Order details</h2>
              <hr className='h-4' />
              <div className="flex justify-between py-2 font-bold">
                <span>SUBTOTAL</span>
                <span id="subtotal">Rs {order.totalAmount-salesTax-shippingCharge}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping</span>
                <span>Rs {shippingCharge}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Sales Tax</span>
                <span>Rs {salesTax}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span id="estimated-total">Rs {order.totalAmount}</span>
              </div>
          <div className="font-semibold text-lg mt-8">Payment status: {order.payment.status ? "Paid" : "Failed"}</div> {/* Shipping + Sales Tax */}
        </div>
      </div>
    </div>
  );
};

export default Package;
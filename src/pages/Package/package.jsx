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

  // Check if the order is cancelled
  const isOrderCancelled = () => {
    return order?.cancelledDate !== null && order?.cancelledDate !== undefined;
  };

  const getStatusClass = (status) => {
    if (status === 'Confirmed') return 'bg-orange-500';
    if (status === 'Shipped') return 'bg-orange-500';
    if (status === 'Delivered') return 'bg-orange-500';
    return 'bg-gray-300';
  };

  const getLineWidth = () => {
    if (isOrderCancelled()) return '0%'; // No progress bar for cancelled orders
    if (order?.deliveredDate) return '100%';
    if (order?.shippedDate) return '66%';
    return '33%';
  };
  
  // Calculate discounted price for each item
  const getDiscountedPrice = (item) => {
    return item.discount ? item.price - item.discount : item.price;
  };
  
  // Calculate item total with discounts
  const calculateItemTotal = (item) => {
    const discountedPrice = getDiscountedPrice(item);
    return discountedPrice * item.quantity;
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
      <h1 className="text-2xl font-bold mb-6">
        {isOrderCancelled() ? "CANCELLED ORDER" : "TRACK YOUR PACKAGE"}
      </h1>
      <p className="text-gray-600 mb-4">
        {isOrderCancelled() ? (
          <span className="text-red-500">This order has been cancelled.</span>
        ) : (
          <>Estimated Delivery: <span className="font-bold">{order.estimatedDate ? new Date(order.estimatedDate).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
          }) : "TBD"}</span></>
        )}
      </p>

      <div className="bg-white-200 p-4 rounded-lg shadow-md mb-8 border-t-4 border-gray-300">
        {isOrderCancelled() ? (
          <div className="cancelled-order-status">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <p className="text-xl font-bold text-center text-red-500">Order Cancelled</p>
            <p className="text-center text-gray-500 mt-2">
              {order.cancelledDate ? `Cancelled on ${new Date(order.cancelledDate).toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
              })}` : ""}
            </p>
          </div>
        ) : (
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
        )}
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
                  <div className="flex flex-col items-end">
                    <span className="font-medium">Rs {getDiscountedPrice(item)}</span>
                    {item.discount > 0 && (
                      <span className="text-gray-400 line-through text-sm">Rs {item.price}</span>
                    )}
                  </div>
                  <div className="flex items-center border rounded">
                    <input id={`quantity-${index}`} type="text" value={`x ${item.quantity}`} className="w-8 text-center border-l border-r" readOnly />
                  </div>
                  <span id={`total-${index}`} className="font-medium">Rs {calculateItemTotal(item)}</span>
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
            <span id="subtotal">Rs {order.itemTotal}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Shipping</span>
            <span>Rs {order.shippingCharge}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Sales Tax</span>
            <span>Rs {order.salesTax}</span>
          </div>
          {order.coupon && order.coupon.discountAmount > 0 && (
              <div className="cart-total-details flex justify-between py-2 coupon-discount">
                <span>Discount</span>
                <span>Rs -{order.coupon.discountAmount}</span>
              </div>
            )}
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL:</span>
            <span id="estimated-total">Rs {order.totalAmount}</span>
          </div>
          <div className="font-semibold text-lg mt-8">
            Payment: {order.payment.method === 'razorpay' 
              ? (order.payment.status ? "Paid Online ✓" : "Payment Failed ✗") 
              : (order.payment.status ? "Cash Paid on Delivery ✓" : "Cash on Delivery (Pending)")}
          </div>
          
          {/* Show cancellation details if order is cancelled */}
          {isOrderCancelled() && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 font-medium">Order Cancelled</p>
              <p className="text-red-700 text-sm mt-1">
                This order was cancelled on {new Date(order.cancelledDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
  
          {/* Display customization details if they exist */}
          {order.customization && order.customization.required && (
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-2">Customization Details</h3>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap">{order.customization.details}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Package;
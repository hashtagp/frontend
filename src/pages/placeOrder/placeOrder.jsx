import React, { useContext, useState, useEffect } from 'react';
import './placeOrder.css';
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartValue, value, token, item_list, cartItems, url } = useContext(StoreContext);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Customization states
  const [needsCustomization, setNeedsCustomization] = useState(false);
  const [customizationDetails, setCustomizationDetails] = useState("");
  
  // Dynamic shipping states
  const [shippingCharge, setShippingCharge] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState("");
  
  // Added state for postal code validation error
  const [postalCodeError, setPostalCodeError] = useState("");
  
  // Added state for COD availability
  const [isCodAvailable, setIsCodAvailable] = useState(true);
  
  // Get location state for Buy Now functionality
  const location = useLocation();
  const isBuyNow = location.state?.isBuyNow || false;
  const buyNowItem = location.state?.buyNowItem;
  
  // Determine which items to process based on Buy Now or normal cart flow
  const getItemsForOrder = () => {
    if (isBuyNow && buyNowItem) {
      return [{ ...buyNowItem, quantity: 1 }];
    } else {
      let orderItems = [];
      item_list.forEach((item) => {
        if (cartItems[item._id] && cartItems[item._id].quantity > 0) {
          let itemInfo = { ...item, quantity: cartItems[item._id].quantity };
          console.log("Adding item to order:", itemInfo);
          orderItems.push(itemInfo);
        }
      });
      return orderItems;
    }
  };
  
  // Calculate cart total value considering Buy Now mode and discounted prices
  const calculateTotal = () => {
    if (isBuyNow && buyNowItem) {
      return buyNowItem.price - buyNowItem.discount;
    } else {
      let total = 0;
      item_list.forEach((item) => {
        if (cartItems[item._id] && cartItems[item._id].quantity > 0) {
          const discountedPrice = item.price - item.discount;
          total += discountedPrice * cartItems[item._id].quantity;
        }
      });
      return total;
    }
  };

  // Constants for order calculation
  const itemTotal = calculateTotal();
  const salesTax = Math.round(itemTotal * 0.18); // 18% GST

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: ""
  });

  const bangalorePincodes = [
    // Bangalore Urban
    '560001', '560002', '560003', '560004', '560005', '560006', '560007', '560008', '560009',
      '560010', '560011', '560012', '560013', '560014', '560015', '560016', '560017', '560018',
      '560019', '560020', '560021', '560022', '560023', '560024', '560025', '560026', '560027',
      '560028', '560029', '560030', '560032', '560033', '560034', '560035', '560036', '560037',
      '560038', '560039', '560040', '560041', '560042', '560043', '560045', '560046', '560047',
      '560048', '560049', '560050', '560051', '560052', '560053', '560054', '560055', '560056',
      '560057', '560058', '560059', '560060', '560061', '560062', '560063', '560064', '560065',
      '560066', '560067', '560068', '560069', '560070', '560071', '560072', '560073', '560074',
      '560075', '560076', '560077', '560078', '560079', '560080', '560081', '560082', '560083',
      '560084', '560085', '560086', '560087', '560088', '560089', '560090', '560091', '560092',
      '560093', '560094', '560095', '560096', '560097', '560098', '560099', '560100', '560102'
  ];

  // Calculate the order total
  const orderTotal = itemTotal + shippingCharge + salesTax - (couponApplied ? couponDiscount : 0);

  // Effect to update COD availability based on order total
  useEffect(() => {
    // If order total exceeds ₹5000, disable COD
    if (orderTotal > 5000) {
      setIsCodAvailable(false);
      // If current payment method is COD, switch to online payment
      if (paymentMethod === 'cod') {
        setPaymentMethod('razorpay');
      }
    } else {
      setIsCodAvailable(true);
    }
  }, [orderTotal, paymentMethod]);

  // Check if the pincode is valid
  const isValidPincode = (pincode) => {
    return bangalorePincodes.includes(pincode);
  };
  
  // Function to calculate shipping from backend
  const calculateShipping = async () => {
    // Only calculate if we have complete address
    if (!data.street || !data.city || !data.state || !data.postalCode || !isValidPincode(data.postalCode)) {
      return;
    }
    
    setIsCalculatingShipping(true);
    setShippingError("");
    
    try {
      // Call backend API to calculate shipping based on address
      const response = await axios.post(
        `${url}/api/orders/shippingCharge`, 
        { 
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setShippingCharge(response.data.shippingCharge);
      } else {
        setShippingError("Could not calculate shipping. Using default rate.");
        setShippingCharge(100); // Default fallback
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
      setShippingError("Error calculating shipping. Using default rate.");
      setShippingCharge(100); // Default fallback
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Trigger shipping calculation when address changes
  useEffect(() => {
    // If we have a complete address, calculate after a short delay
    if (data.street && data.city && data.state && data.postalCode && isValidPincode(data.postalCode)) {
      const timer = setTimeout(() => {
        calculateShipping();
      }, 1000); // Delay to avoid calculating while user is typing
      
      return () => clearTimeout(timer);
    }
  }, [data.street, data.city, data.state, data.postalCode]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setIsApplying(true);
    setCouponError("");
    
    try {
      const response = await axios.post(
        `${url}/api/coupon/validate`, 
        { 
          code: couponCode,
          orderAmount: itemTotal // Use calculated total with discounted prices
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
      
      if (response.data.success) {
        setCouponApplied(true);
        setCouponDiscount(response.data.coupon.discountAmount);
        setCouponError("");
      } else {
        setCouponError(response.data.message || "Invalid coupon");
        setCouponDiscount(0);
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || "Error validating coupon");
      setCouponDiscount(0);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponError("");
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    
    // Check postal code validity without alert
    if (!isValidPincode(data.postalCode)) {
      setPostalCodeError("Please enter a valid Bangalore postal code.");
      return;
    }

    // Don't proceed if still calculating shipping
    if (isCalculatingShipping) {
      alert("Please wait while we calculate shipping charges.");
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      const orderItems = getItemsForOrder();
      const totalAmount = itemTotal + shippingCharge + salesTax - (couponApplied ? couponDiscount : 0);

      let orderData = {
        address: data,
        items: orderItems,
        amount: totalAmount,
        itemTotal: itemTotal, // Use calculated total with discounted prices
        salesTax: salesTax,
        shippingCharge: shippingCharge,
        couponCode: couponApplied ? couponCode : null,
        couponDiscount: couponApplied ? couponDiscount : 0,
        payment: {
          method: paymentMethod,
          status: false // Payment status is initially false for both methods
        },
        customization: {
          required: needsCustomization,
          details: needsCustomization ? customizationDetails : ""
        },
        isBuyNow: isBuyNow
      };
      
      const response = await axios.post(
        `${url}/api/order/place`, 
        orderData, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        if (paymentMethod === 'razorpay') {
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
              contact: data.phone,
            },
            theme: {
              color: "#3399cc",
            },
            modal: {
              ondismiss: function() {
                setIsPlacingOrder(false);
              }
            }
          };

          if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            console.error("Razorpay SDK not loaded.");
            setIsPlacingOrder(false);
            alert("Payment gateway is not available. Please try again later.");
          }
        } else {
          // For COD, redirect directly to success page
          navigate(`/verify?success=true&orderId=${response.data.newOrderId}`);
        }
      } else {
        setIsPlacingOrder(false);
        alert(response.data.message || "Error in processing the order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      setIsPlacingOrder(false);
      alert(error.response?.data?.message || "Error processing your order. Please try again.");
    }
  };

  // Updated onChangeHandler to validate postal code as user types
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
    
    // Validate postal code as user types
    if (name === 'postalCode') {
      if (value && !isValidPincode(value)) {
        setPostalCodeError("Please enter a valid Bangalore postal code.");
      } else {
        setPostalCodeError("");
      }
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (token === "" || value) {
      return;
    }
    
    // Don't redirect if it's a Buy Now flow
    if (isBuyNow && buyNowItem) {
      return;
    }
    
    if (!token) {
      navigate('/cart');
    } else if (calculateTotal() === 0) {
      navigate('/cart');
    }
  }, [token, value, navigate, isBuyNow, buyNowItem]);

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
        <input 
          required 
          name="postalCode" 
          onChange={onChangeHandler} 
          value={data.postalCode} 
          type="text" 
          placeholder="Postal Code" 
          className={postalCodeError ? "error-input" : ""}
        />
        {postalCodeError && (
          <div className="input-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {postalCodeError}
          </div>
        )}
        <label>Phone</label>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="tel" pattern="[6-9]{1}[0-9]{9}" placeholder="Phone" />
        
        {/* Customization Section */}
        <div className="customization-section">
          <h3>Do you need logo or customization?</h3>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="customization"
                checked={needsCustomization === true}
                onChange={() => setNeedsCustomization(true)}
              />
              <span>Yes</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="customization"
                checked={needsCustomization === false}
                onChange={() => setNeedsCustomization(false)}
              />
              <span>No</span>
            </label>
          </div>
          
          {needsCustomization && (
            <div className="customization-details">
              <textarea
                placeholder="Please provide details about your logo or customization requirements"
                value={customizationDetails}
                onChange={(e) => setCustomizationDetails(e.target.value)}
                rows={3}
                className="customization-textarea"
              />
              <p className="customization-note">
                Our team will contact you regarding your customization within 24 hours of order placement.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="place-order-right">
        <div className="coupon-section">
          <h2>Enter Promo Code</h2>
          <div className="coupon-input-container">
            <input 
              type="text" 
              placeholder="Enter coupon code" 
              value={couponCode} 
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={isApplying || couponApplied}
            />
            {couponApplied ? (
              <button 
                type="button" 
                onClick={handleRemoveCoupon}
                className="remove-coupon-btn"
              >
                Remove
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleApplyCoupon} 
                disabled={isApplying || !couponCode.trim()}
              >
                {isApplying ? "Applying..." : "Apply"}
              </button>
            )}
          </div>
          {couponError && (
            <div className="coupon-error" style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
              {couponError}
            </div>
          )}
          {couponApplied && (
            <div className="coupon-success" style={{ color: 'green', marginTop: '8px', fontSize: '14px' }}>
              Coupon applied successfully!
            </div>
          )}
        </div>
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details flex justify-between py-2">
              <span>Subtotal</span>
              <span>&#8377;{itemTotal}</span>
            </div>
            <hr />
            <div className="cart-total-details flex justify-between py-2">
              <span>Shipping</span>
              {isCalculatingShipping ? (
                <span className="calculating-shipping">Calculating...</span>
              ) : (
                <span>&#8377;{shippingCharge}</span>
              )}
            </div>
            <div className="cart-total-details flex justify-between py-2">
              <span>Sales Tax</span>
              <span>&#8377;{salesTax}</span>
            </div>
            {couponApplied && couponDiscount > 0 && (
              <div className="cart-total-details flex justify-between py-2 coupon-discount">
                <span>Discount</span>
                <span>-&#8377;{couponDiscount}</span>
              </div>
            )}
            <hr />
            <div className="cart-total-details mt-2 flex justify-between py-2">
              <b>Total</b>
              <b>&#8377;{orderTotal}</b>
            </div>
            {orderTotal > 5000 && (
              <div className="order-note" style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                * Orders above ₹5,000 require online payment
              </div>
            )}
          </div>

          {/* Payment options */}
          <div className="payment-options">
            <h3>Payment Method</h3>
            <div className="payment-selection">
              <label className={`payment-option ${paymentMethod === 'razorpay' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                />
                <div className="payment-option-content">
                  <span className="radio-custom"></span>
                  <div className="payment-label-group">
                    <span className="payment-label">Pay Online</span>
                    <span className="payment-sublabel">Credit/Debit Card, UPI, NetBanking</span>
                  </div>
                </div>
              </label>
              
              {isCodAvailable ? (
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="payment-option-content">
                    <span className="radio-custom"></span>
                    <div className="payment-label-group">
                      <span className="payment-label">Cash on Delivery</span>
                      <span className="payment-sublabel">Pay when your order arrives</span>
                    </div>
                  </div>
                </label>
              ) : (
                <div className="payment-option-disabled">
                  <div className="payment-option-content">
                    <span className="radio-custom disabled"></span>
                    <div className="payment-label-group">
                      <span className="payment-label text-gray-400">Cash on Delivery</span>
                      <span className="payment-sublabel text-gray-400">Not available for orders above ₹5,000</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPlacingOrder || isCalculatingShipping}
          >
            {isPlacingOrder ? 'Processing...' : 
             isCalculatingShipping ? 'Calculating shipping...' :
             paymentMethod === 'razorpay' ? 'Proceed to Payment' : 'Place Order'}
          </button>
          
          {shippingError && (
            <div style={{ color: 'orange', marginTop: '8px', fontSize: '14px', textAlign: 'center' }}>
              {shippingError}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
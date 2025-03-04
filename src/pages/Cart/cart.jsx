import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, token, addToCart, removeFromCart, getTotalCartValue, item_list } = useContext(StoreContext);
  const navigate = useNavigate();
  const [minCartError, setMinCartError] = useState(false);
  
  // Minimum cart value required for checkout
  const MIN_CART_VALUE = 1000;

  // Get discounted price for an item
  const getDiscountedPrice = (item) => {
    return item.discount ? item.price - item.discount : item.price;
  };

  // Calculate total considering discounts
  const calculateTotal = (quantity, price, discount = 0) => {
    const discountedPrice = price - discount;
    return quantity * discountedPrice;
  };

  const redirect = () => {
    if (!token) {
      console.log("Token not found. Redirecting to login page.");
      navigate('/login');
    } else if (getDiscountedSubtotal() === 0) {
      console.log("Cart is empty. Staying on cart page.");
      navigate('/cart');
    } else if (getDiscountedSubtotal() < MIN_CART_VALUE) {
      console.log(`Cart value below minimum (₹${MIN_CART_VALUE}). Showing error.`);
      setMinCartError(true);
      // Hide the error message after 3 seconds
      setTimeout(() => setMinCartError(false), 3000);
    } else {
      navigate('/placeOrder');
    }
  }

  // Updated to match the placeOrder.jsx approach (18% GST)
  const calculateSalesTax = () => {
    return Math.round(subtotal * 0.18); // 18% GST
  };

  // Calculate subtotal with discounts applied
  const getDiscountedSubtotal = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      // Find the full item details with discount info
      const item = item_list.find(item => item._id === itemId);
      if (!item) return total; // Skip if item not found
      
      const discountedPrice = item.price - (item.discount || 0);
      return total + (discountedPrice * cartItems[itemId].quantity);
    }, 0);
  };

  const subtotal = getDiscountedSubtotal();
  const salesTax = subtotal > 0 ? calculateSalesTax() : 0;
  const estimatedTotal = subtotal + salesTax;

  return (
    <div className="bg-white">
      <div className="cart mx-auto px-4 py-8">
        {/* Cart Page Header */}
        <h1 className="text-2xl font-bold mb-6">CART PAGE</h1>

        {/* Conditional Rendering for Empty Cart */}
        {Object.keys(cartItems).length === 0 ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">No items added</h2>
            <button className="mt-4 py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800" onClick={() => navigate('/products')}>Shop Now</button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Products Section */}
            <div className="w-full lg:w-2/3 bg-white-200 p-6 rounded-lg shadow-md border-t-4 border-gray-300">
              <h2 className="text-xl font-bold mb-4">Products</h2>
              <div id="cart-items" className="space-y-6">
                {Object.keys(cartItems).map((itemId, index) => {
                  // Find the full item details with discount info
                  const fullItem = item_list.find(item => item._id === itemId);
                  const discount = fullItem ? fullItem.discount : 0;
                  const discountedPrice = fullItem ? fullItem.price - discount : cartItems[itemId].price;
                  
                  return (
                    <div key={itemId} className="flex flex-wrap items-center justify-between border-b pb-4 rounded-lg p-4">
                      <img src={cartItems[itemId].image} alt={cartItems[itemId].name} className="w-40 h-40 rounded-lg object-cover" />
                      <div className="flex-1 ml-4">
                        <h2 className="text-md font-semibold">{cartItems[itemId].name}</h2>
                        <p className="text-md text-gray-800">Quantity: {cartItems[itemId].quantity}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end">
                          <span className="font-medium">Rs {discountedPrice}</span>
                          {discount > 0 && (
                            <span className="text-gray-400 line-through text-sm">Rs {cartItems[itemId].price}</span>
                          )}
                        </div>
                        <div className="flex items-center border rounded">
                          <button className="px-2 py-1 text-gray-600" onClick={(event) => removeFromCart(itemId)}>-</button>
                          <input id={`quantity-${index}`} type="text" value={cartItems[itemId].quantity} className="w-8 text-center border-l border-r" readOnly />
                          <button className="px-2 py-1 text-gray-600" onClick={(event) => addToCart({ ...cartItems[itemId], id: itemId })}>+</button>
                        </div>
                        <span id={`total-${index}`} className="font-medium">
                          Rs {calculateTotal(cartItems[itemId].quantity, cartItems[itemId].price, discount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Section */}
            <div className="w-full lg:w-1/3 bg-white-200 p-6 rounded-lg shadow-md border-t-4 border-gray-300">
              <h2 className="text-xl font-bold mb-4">SUMMARY</h2>
              <hr className='h-4' />
              <div className="flex justify-between py-2 font-bold">
                <span>SUBTOTAL</span>
                <span id="subtotal">Rs {subtotal}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping</span>
                <span className="text-gray-600 italic">Calculated at checkout</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Sales Tax</span>
                <span>Rs {salesTax}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span id="estimated-total">Rs {estimatedTotal}</span>
              </div>
              <div className="text-gray-500 text-xs mt-1 mb-3 text-right">
                *Final total will include shipping charges
              </div>
              
              {/* Minimum order requirement notice */}
              <div className={`text-sm mt-2 mb-2 ${subtotal >= MIN_CART_VALUE ? 'text-green-600' : 'text-gray-600'}`}>
                {subtotal >= MIN_CART_VALUE 
                  ? '✅ Minimum order value met' 
                  : `Minimum order: ₹${MIN_CART_VALUE} (₹${MIN_CART_VALUE - subtotal} more needed)`}
              </div>
              
              <button 
                className={`w-full mt-2 py-2 text-white rounded-lg ${subtotal >= MIN_CART_VALUE 
                  ? 'bg-orange-500 hover:bg-gray-800' 
                  : 'bg-gray-400 cursor-not-allowed'}`} 
                onClick={() => redirect()}
              >
                CHECKOUT
              </button>
              
              {/* Error message if minimum not met */}
              {minCartError && (
                <div className="text-red-500 text-sm mt-2 text-center animate-pulse">
                  Please add items worth ₹{MIN_CART_VALUE - subtotal} more to proceed to checkout.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { url, addToCart, token } = useContext(StoreContext);
  const [length, setLength] = useState(false);
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate(); // Add navigate hook
  
  // Minimum price for Buy Now
  const MIN_BUY_NOW_VALUE = 1000;

  const bangalorePincodes = [
    // Bangalore Urban
    "560001", "560002", "560003", "560004", "560005", "560006", "560007", "560008", "560009", "560010",
    // ...other pincodes (truncated for brevity)
    "561441", "561442", "561443","563101"
  ];   

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${url}/api/products/${productId}`);
        setProduct(response.data);
        console.log('Product:', response.data);
      } catch (error) {
        console.error('Error fetching the product:', error);
      }
    };

    fetchProduct();
  }, [productId, url]);

  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const handlePincodeCheck = () => {
    if (pincode.length === 6 && bangalorePincodes.includes(pincode)) {
      setPincodeMessage('Yayy! We are there at your location.');
      setLength(true);
    } else {
      setPincodeMessage('Please enter a valid pincode.');
      setLength(false);
    }
  };

  const handleAddToCart = () => {
    setDisable(true);
    const productToAdd = { ...product, id: product._id };
    console.log('Adding to cart:', productToAdd);
    addToCart(productToAdd);
    setIsAddedToCart(true);
    setDisable(false);
  };

  // New Buy Now handler
  const handleBuyNow = () => {
    setDisable(true);
    if(token){
      const productToAdd = { ...product, id: product._id };
      
      // Navigate to place order with just this product
      navigate('/placeOrder', { 
        state: { 
          buyNowItem: productToAdd,
          isBuyNow: true
        } 
      });
    } else {
      navigate('/signup');
    }
  };

  if (!product) {
    return (
      <div className='loading'>
          <div className="spinner">
          </div>
      </div>
    );
  }

  const discountedPrice = product.price - product.discount;
  const isBuyNowAllowed = discountedPrice >= MIN_BUY_NOW_VALUE;

  return (
    <main className="product-container mx-auto p-4 bg-gray-50">
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        {/* Product Image */}
        <div className="flex-shrink-0 lg:w-1/2">
          <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg px-2 py-2" />
          <div className="flex space-x-3 mt-5 overflow-x-auto gap-2"></div>
        </div>

        {/* Product Details */}
        <div className="mt-8 lg:mt-0 lg:w-1/2">
          <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-sm mt-2">Fabric: Cotton</p>
          <p className="text-gray-600 mt-6 font-semibold">
            {product.description}
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <span className="text-xl font-bold text-black">Rs. {discountedPrice}</span>
            {product.discount > 0 && (
              <span className="text-gray-400 line-through">{(product.price)}</span>
            )}
            {/* <span className="text-xs text-gray-500">MRP Inclusive of all taxes</span> */}
          </div>

          <div className="mt-6 flex flex-col space-y-4">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="py-2 bg-white border border-black text-orange-500 hover:bg-gray-100 rounded-2xl w-full font-semibold"
              disabled={disable}
            >
              {isAddedToCart ? 'Add More...' : 'Add to Cart'}
            </button>
            
            {/* Only show Buy Now if price meets minimum requirement */}
            {isBuyNowAllowed ? (
              <button 
                onClick={handleBuyNow}
                className="py-2 bg-orange-400 hover:bg-orange-500 rounded-2xl w-full font-semibold text-white"
                disabled={disable}
              >
                Buy Now
              </button>
            ) : (
              <div className="text-xs text-gray-500 text-center">
                Buy Now is available for products ₹1,000 and above. Please add to cart and checkout with additional items.
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Enter Pin to Check delivery"
              value={pincode}
              onChange={handlePincodeChange}
              className="w-auto border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handlePincodeCheck}
              className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              CHECK
            </button>
          </div>
          {pincodeMessage && (
            <p className={`text-sm mt-4 ${length ? 'text-green-600' : 'text-red-600'}`}>
              {pincodeMessage}
            </p>
          )}
          <br />
          <p className="text-gray-600 text-sm mt-4">Over {product.bundlesSold} bundles sold so far</p>
          <hr className="h-px my-6 bg-gray-400 border-0 dark:bg-gray-800" />
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <div className="flex items-center space-x-2 text-gray-700">
              <i className="fa-solid fa-car-side"></i><span>Home delivery within 10 days or less</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              &#10005;&nbsp;<span>Cancellation within 24 hours only</span>
            </div>
          </div>
          <hr className="h-px my-6 bg-gray-500 border-0 dark:bg-gray-800" />
        </div>
      </div>
    </main>
  );
};

export default Product;
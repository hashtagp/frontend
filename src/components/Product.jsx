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

  const bangalorePincodes = [
    // Bangalore Urban
    "560001", "560002", "560003", "560004", "560005", "560006", "560007", "560008", "560009", "560010",
    "560011", "560012", "560013", "560014", "560015", "560016", "560017", "560018", "560019", "560020",
    "560021", "560022", "560023", "560024", "560025", "560026", "560027", "560028", "560029", "560030",
    "560031", "560032", "560033", "560034", "560035", "560036", "560037", "560038", "560039", "560040",
    "560041", "560042", "560043", "560044", "560045", "560046", "560047", "560048", "560049", "560050",
    "560051", "560052", "560053", "560054", "560055", "560056", "560057", "560058", "560059", "560060",
    "560061", "560062", "560063", "560064", "560065", "560066", "560067", "560068", "560069", "560070",
    "560071", "560072", "560073", "560074", "560075", "560076", "560077", "560078", "560079", "560080",
    "560081", "560082", "560083", "560084", "560085", "560086", "560087", "560088", "560089", "560090",
    "560091", "560092", "560093", "560094", "560095", "560096", "560097", "560098", "560099", "560100",
    "560101", "560102", "560103", "560104", "560105", "560106", "560107", "560108", "560109", "560110",
    "560111", "560112", "560113", "560114", "560115", "560116", "560117", "560118", "560119", "560120",
    // Bangalore Rural
    "561101", "561110", "561203", "561204", "561205", "561206", "561207", "561208", "561209", "561210",
    "561211", "561212", "561213", "561214", "561215", "561216", "561217", "561218", "561219", "561220",
    "561221", "561222", "561223", "561224", "561225", "561226", "561227", "561228", "561229", "561230",
    "561231", "561232", "561233", "561234", "561235", "561236", "561237", "561238", "561239", "561240",
    "561241", "561242", "561243", "561244", "561245", "561246", "561247", "561248", "561249", "561250",
    "561251", "561252", "561253", "561254", "561255", "561256", "561257", "561258", "561259", "561260",
    "561261", "561262", "561263", "561264", "561265", "561266", "561267", "561268", "561269", "561270",
    "561271", "561272", "561273", "561274", "561275", "561276", "561277", "561278", "561279", "561280",
    "561281", "561282", "561283", "561284", "561285", "561286", "561287", "561288", "561289", "561290",
    "561291", "561292", "561293", "561294", "561295", "561296", "561297", "561298", "561299", "561300",
    "561301", "561302", "561303", "561304", "561305", "561306", "561307", "561308", "561309", "561310",
    "561311", "561312", "561313", "561314", "561315", "561316", "561317", "561318", "561319", "561320",
    "561321", "561322", "561323", "561324", "561325", "561326", "561327", "561328", "561329", "561330",
    "561331", "561332", "561333", "561334", "561335", "561336", "561337", "561338", "561339", "561340",
    "561341", "561342", "561343", "561344", "561345", "561346", "561347", "561348", "561349", "561350",
    "561351", "561352", "561353", "561354", "561355", "561356", "561357", "561358", "561359", "561360",
    "561361", "561362", "561363", "561364", "561365", "561366", "561367", "561368", "561369", "561370",
    "561371", "561372", "561373", "561374", "561375", "561376", "561377", "561378", "561379", "561380",
    "561381", "561382", "561383", "561384", "561385", "561386", "561387", "561388", "561389", "561390",
    "561391", "561392", "561393", "561394", "561395", "561396", "561397", "561398", "561399", "561400",
    "561401", "561402", "561403", "561404", "561405", "561406", "561407", "561408", "561409", "561410",
    "561411", "561412", "561413", "561414", "561415", "561416", "561417", "561418", "561419", "561420",
    "561421", "561422", "561423", "561424", "561425", "561426", "561427", "561428", "561429", "561430",
    "561431", "561432", "561433", "561434", "561435", "561436", "561437", "561438", "561439", "561440",
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
  }else{
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
            <span className="text-gray-400 line-through">{(product.price)}</span>
            <span className="text-xs text-gray-500">MRP Inclusive of all taxes</span>
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
            {/* Buy Now Button with onClick handler */}
            <button 
              onClick={handleBuyNow}
              className="py-2 bg-orange-400 hover:bg-orange-500 rounded-2xl w-full font-semibold text-white"
              disabled={disable}
            >
              Buy Now
            </button>
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
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
    "561441", "561442", "561443"
  ];   

  const calculateSalesTax = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = cartItems[itemId];
      console.log("Calculating sales tax for item:", item.gst * item.quantity);
      return total + (item.gst * item.quantity);
    }, 0);
  };

  const isValidPincode = (pincode) => {
    return bangalorePincodes.includes(pincode);
  };

  const salesTax = calculateSalesTax();
  const shippingCharge = 100;

  const placeOrder = async (event) => {
    event.preventDefault();
    if (!isValidPincode(data.postalCode)) {
      alert("Invalid postal code. Please enter a valid Bangalore postal code.");
      return;
    }
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

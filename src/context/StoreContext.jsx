import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [value, setValue] = useState(false);
  const [item_list, setItemList] = useState([]);
  const url = "https://backend.devcreationsgifts.com/";
  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleTokenExpiration = () => {
    toast.error("Session expired. Please log in again.");
    clearToken();
  };

  const verify = async () => {
    if (isAdminRoute && token) {
      try {
        const response = await axios.get(`${url}/api/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Admin verified!!")
      } catch (error) {
        console.error("Error during admin verification:", error);
        if(error.response){
          if (error.response.status === 401) {
            console.log("Unauthorized access. Logging out...");
            // Clear token
            localStorage.removeItem("token");
            setToken("");
          }
        } else if (error.request) {
          // This handles cases where no response is received
          console.log("No response received:", error.request);
        } else {
          console.log("Error message:", error.message);
        }
      }
    }
  };

  const addToCart = async (item) => {
    const { id, price } = item;
    console.log("Adding item to cart:", item);
    if (token) {
      try {
        const response = await axios.post(url + "/api/cart/add", { itemId: id, quantity: 1, price }, { headers: { Authorization: `Bearer ${token}` } });
        console.log("Item added to cart on server:", response.data);
        setCartItems((prev) => {
          const newCartItems = { ...prev };
          if (!newCartItems[id]) {
            console.log("Item not found in cart. Adding new item:", item);
            newCartItems[id] = { ...item, quantity: 1 };
            console.log("Item added to cart:", newCartItems[id]);
          } else {
            newCartItems[id].quantity += 1;
            console.log("Item quantity updated:", newCartItems[id]);
          }
          return newCartItems;
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleTokenExpiration();
        } else {
          console.error("Error adding item to cart on server:", error);
        }
      }
    } else {
      toast.error("Please login to add items to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    console.log("Removing item from cart:", itemId);
    if (token) {
      try {
        const response = await axios.post(url + "/api/cart/remove", { itemId }, { headers: { Authorization: `Bearer ${token}` } });
        console.log("Item removed from cart on server:", response.data);
        setCartItems((prev) => {
          const newCartItems = { ...prev };
          if (newCartItems[itemId].quantity > 1) {
            newCartItems[itemId].quantity -= 1;
            console.log("Item quantity decreased:", newCartItems[itemId]);
          } else {
            delete newCartItems[itemId];
            console.log("Item removed from cart:", itemId);
          }
          return newCartItems;
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleTokenExpiration();
        } else {
          console.error("Error removing item from cart on server:", error);
        }
      }
    } else {
      toast.error("Please login to remove items from cart");
    }
  };

  const getTotalCartValue = () => {
    let totalValue = 0;
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      totalValue += item.price * item.quantity;
    }
    return totalValue;
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { Authorization: `Bearer ${token}` } });
      console.log("Loaded cart data from server:", response.data);
      setCartItems(response.data.reduce((acc, item) => {
        acc[item.itemId] = item;
        return acc;
      }, {}));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleTokenExpiration();
      } else {
        console.error("Error loading cart data from server:", error);
      }
    }
  };

  const saveToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    loadCartData(token); // Load cart data after setting the token
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  useEffect(() => {
    verify();
  }, [location.pathname, token]);
  

  useEffect(() => {
    async function loadData() {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function fetchItemList() {
      try {
        const response = await axios.get(url + "/api/products/allProducts");
        setItemList(response.data.products);
      } catch (error) {
        console.error("Error fetching item list:", error);
      }
    }
    fetchItemList();
  }, []);

  useEffect(() => {
    const totalValue = getTotalCartValue();
    if (totalValue > 0) {
      setValue(true);
    }
  }, [cartItems]);

  const contextValue = {
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartValue,
    value,
    url,
    token,
    setToken: saveToken,
    clearToken,
    item_list,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

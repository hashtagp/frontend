import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { StoreContext } from "../../../context/StoreContext";
import "./AdminLoginSignup.css";

const AdminLoginSignup = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const { url, setToken } = useContext(StoreContext);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("Form submitted:", data);
    try {
      const res = await axios.post(url + "/api/admin/login", data);
      console.log(res);
      if (res.data.success) {
        console.log("Login successful, closing popup");
        setToken(res.data.accessToken);
      } else {
        console.log("Login failed");
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="admin-login-popup">
      <div className="admin-login-popup-container">
        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            name="username"
            value={data.username}
            onChange={onChangeHandler}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            placeholder="Password"
            required
          />
          <button className="admin-bt" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginSignup;
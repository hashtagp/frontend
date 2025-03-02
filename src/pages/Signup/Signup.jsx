import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Signup.css';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

function Signup() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isActive, setIsActive] = useState(false);
  // Original variables for signup
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // New variables for signin
  const [signinUsername, setSigninUsername] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [disable, setDisable] = useState(false);
  const { url, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 600);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSignInClick = () => {
    setIsActive(false);
    setSignupError('');
    setLoginError('');
  };

  const handleSignUpClick = () => {
    setIsActive(true);
    setSignupError('');
    setLoginError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setDisable(true);
    setSignupError('');
    try {
      const response = await axios.post(`${url}/api/auth/register`, { username, email, password });
      if (response.data.success === false) {
        setSignupError(response.data.message);
        setDisable(false);
        return;
      }
      setToken(response.data.accessToken);
      localStorage.setItem('token', response.data.accessToken);
      setDisable(false);
      navigate('/');
    } catch (error) {
      setSignupError(error.response?.data?.message || 'An error occurred during registration');
      setDisable(false);
      console.error('There was an error registering the user!', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setDisable(true);
    setLoginError('');
    try {
      const response = await axios.post(`${url}/api/auth/login`, { username: signinUsername, password: signinPassword });
      if (response.data.success === false) {
        setLoginError(response.data.message);
        setDisable(false);
        return;
      }
      setToken(response.data.accessToken);
      localStorage.setItem('token', response.data.accessToken);
      setDisable(false);
      navigate('/');
    } catch (error) {
      setLoginError(error.response?.data?.message || 'An error occurred during login');
      setDisable(false);
      console.error('There was an error logging in the user!', error);
    }
  };

  return (
    <div className={`auth-container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>
          {signupError && <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>{signupError}</div>}
          <input type="text" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <p>By signing in, you agree to our</p>
          <a className='tnc' onClick={() => navigate("/terms-and-conditions")}>*Terms and Conditions</a>
          <br />
          <button type="submit" disabled={disable}>Sign Up</button>
          <br />
        </form>
      </div>
      {isMobile && (
        <hr />
      )}
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          {loginError && <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>{loginError}</div>}
          <input type="text" placeholder="Username" value={signinUsername} onChange={(e) => setSigninUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} required />
          <a href="#">Forget Your Password?</a>
          <button type="submit" disabled={disable}>Sign In</button>
        </form>
      </div>
      {!isMobile && (
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button id="login" onClick={handleSignInClick}>Sign Up</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button id="register" onClick={handleSignUpClick}>Sign In</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
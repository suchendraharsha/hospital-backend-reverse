// src/components/Login/Login.js
import React, { useState, useContext } from "react";
import "./login.css"; // Make sure this CSS file exists with your styles
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.js"; // Import AuthContext

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext); // Use the setToken function from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch('https://back-hospital-1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok && data.token && data.user) {
        setToken(data.token, data.user.id); // Use setToken from context
        navigate('/');
      } else {
        setError(data.msg || "Invalid email or password.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="addUser">
      <h3>Sign in</h3>
      <form className="addUserForm" onSubmit={handleLogin}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      <div className="login">
        <p>Don't have Account? </p>
        <Link to="/signup" className="btn btn-success">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import "./signup.css"; // Make sure this CSS file exists with your styles
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        navigate('/login');
      } else {
        setError(data.errors ? data.errors.map(err => err.msg).join(", ") : data.msg || "Registration failed.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="addUser">
      <h3>Sign Up</h3>
      <form className="addUserForm" onSubmit={handleSignUp}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="off"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
        <div className="inputGroup">
          <button type="submit" className="btn btn-success">
            Sign Up
          </button>
        </div>
      </form>
      <div className="login">
        <p>Already have an Account? </p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
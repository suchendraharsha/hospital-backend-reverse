// src/context/authContext.js
import React, { createContext, useState, useEffect,useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isPro, setIsPro] = useState(false);

  const loadUser = async () => {
    if (authToken && userId) {
      try {
        const res = await fetch('http://localhost:8081/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setIsPro(data.user.isPro);
        }
      } catch (err) {
        console.error('Error loading user:', err);
      }
    } else {
      setIsPro(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [authToken, userId]);

  const setToken = (token, id) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', id);
    setAuthToken(token);
    setUserId(id);
    loadUser();
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setAuthToken(null);
    setUserId(null);
    setIsPro(false);
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, isPro, setToken, logout, setIsPro }}>
      {children}
    </AuthContext.Provider>
  );
};
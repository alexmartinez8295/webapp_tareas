
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up Axios interceptor to include token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  // Fetch user data on load if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // In a real app, you'd have a /api/auth/user endpoint to get user details
          // For now, we'll just assume the token is valid if it exists.
          // You might want to decode the token here to get basic user info if needed.
          // const decoded = JSON.parse(atob(token.split('.')[1]));
          // setUser({ id: decoded.user.id }); // Example: set user ID from token
          setUser({ isAuthenticated: true }); // Simple placeholder
        } catch (err) {
          console.error('Error loading user:', err);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    console.log('Attempting login with:', { email, password });
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser({ isAuthenticated: true }); // Placeholder
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Login failed. Please try again.';
      console.error('Login failed:', errorMessage);
      setToken(null);
      localStorage.removeItem('token');
      return { success: false, message: errorMessage };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser({ isAuthenticated: true }); // Placeholder
      return true;
    } catch (err) {
      console.error('Registration failed:', err.response ? err.response.data : err.message);
      setToken(null);
      localStorage.removeItem('token');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

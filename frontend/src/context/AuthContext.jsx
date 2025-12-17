/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Init User from LocalStorage + Logic to enhance Role
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- MOCK AUTH FUNCTIONS (To be replaced with Real API calls) ---

  const login = async (identifier, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: identifier, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      const user = data.user;
      saveUserSession(user);
      return user;
    } catch (error) {
       console.error('Login Error:', error);
       throw error;
    }
  };

  const saveUserSession = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // In real app, we would also save the JWT token here
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const register = async (userData) => {
    try {
      let body;
      const headers = {};

      if (userData instanceof FormData) {
        // Nếu là FormData (có file upload), KHÔNG set Content-Type
        // Browser sẽ tự set multipart/form-data và boundary
        body = userData;
      } else {
        // Nếu là object thường
        body = JSON.stringify(userData);
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch('http://localhost:3000/api/users/create', {
        method: 'POST',
        headers: headers,
        body: body,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      // Đăng ký thành công -> Lưu session (như logic cũ)
      // Lưu ý: data.data là user object từ backend trả về
      const newUser = data.data;

      // Nếu backend chưa trả về token (vì endpoint create chỉ tạo user),
      // ta có thể login luôn hoặc bắt user login lại.
      // Ở đây ta tạm thời lưu user vào session để vào được Profile.
      saveUserSession(newUser);

      return newUser;
    } catch (error) {
      console.error('Register Error:', error);
      throw error;
    }
  };

  // --- Helper to check permissions ---
  const isAdmin = () => user?.role === 'super_admin' || user?.role_id === 1;
  const isHost = () => user?.role === 'host' || user?.role === 'hotel_manager' || user?.role_id === 4;

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAdmin,
    isHost
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

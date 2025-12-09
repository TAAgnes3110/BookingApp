import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingList from './pages/BookingList';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import ServiceDetail from './pages/ServiceDetail';
import BookingHistory from './pages/BookingHistory';
import Cart from './pages/Cart';
import OTP from './pages/OTP';
import ForgotPassword from './pages/ForgotPassword';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminServices from './pages/admin/Services';
import AdminTransactions from './pages/admin/Transactions';
import AdminReviews from './pages/admin/Reviews';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<BookingList />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/history" element={<BookingHistory />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Placeholder routes */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>
      </Routes>
    </>
  );
};

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

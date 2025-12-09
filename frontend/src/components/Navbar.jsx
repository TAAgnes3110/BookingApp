import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Ticket, MessageCircle, ShoppingCart, User, Menu, X, Globe, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import GlassButton from './GlassButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, isHost, logout } = useAuth();
  const { cartItems } = useCart();

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Đặt phòng', path: '/booking', icon: Ticket },
    // { label: 'Trò chuyện', path: '/chat', icon: MessageCircle }, // Hide temporarily
  ];

  // Logic to count items (rooms) in cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-white/5 border-b border-white/10"
      >
        <Link to="/" className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-400 to-purple-500 shadow-lg shadow-blue-500/20">
            <Globe size={24} className="text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">GlassBooking</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${isActive(item.path) ? 'text-white' : 'text-white/60 hover:text-white'}`}
            >
              <item.icon size={18} />
              {item.label}
              {isActive(item.path) && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-full"
                />
              )}
            </Link>
          ))}

          {/* Admin Link */}
          {isAdmin() && (
            <Link to="/admin" className="flex items-center gap-2 text-sm font-medium text-red-300 hover:text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              <Shield size={16} /> Quản trị
            </Link>
          )}

          {/* Host Link */}
          {!isAdmin() && isHost() && (
            <Link to="/host/properties" className="flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              <Home size={16} /> Kênh Chủ Nhà
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative text-white/60 hover:text-white transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Login Button */}
          {user ? (
            <div className="relative group">
              <Link to="/profile" className="flex items-center gap-2 pl-4 border-l border-white/10">
                <img src={user.avatar_url || "https://ui-avatars.com/api/?name=User"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-white/20" />
                <div className="text-left hidden lg:block">
                  <span className="block text-sm font-bold text-white leading-none">{user.first_name}</span>
                  <span className="text-[10px] text-white/50">{user.role === 'guest' ? 'Thành viên' : user.role}</span>
                </div>
              </Link>

              {/* Dropdown Logout */}
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-48">
                <div className="bg-[#1a1c2e] border border-white/10 rounded-xl p-2 shadow-xl backdrop-blur-xl">
                  <Link to="/history" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg mb-1">
                    Lịch sử đặt phòng
                  </Link>
                  <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <GlassButton className="!py-2 !px-4 text-xs">Đăng nhập</GlassButton>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-3xl md:hidden pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-semibold flex items-center gap-4 ${isActive(item.path) ? 'text-white' : 'text-white/50'}`}
                >
                  <item.icon size={28} />
                  {item.label}
                </Link>
              ))}

              {isAdmin() && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-2xl font-semibold flex items-center gap-4 text-red-400">
                  <Shield size={28} /> Quản trị
                </Link>
              )}

              <hr className="border-white/10" />

              {user ? (
                <>
                  <div className="flex items-center gap-4">
                    <img src={user.avatar_url} className="w-12 h-12 rounded-full" />
                    <div>
                      <div className="text-white font-bold">{user.first_name} {user.last_name}</div>
                      <div className="text-white/50 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="text-xl text-red-500 flex items-center gap-2 mt-4">
                    <LogOut size={24} /> Đăng xuất
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <GlassButton className="w-full justify-center">Đăng nhập ngay</GlassButton>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

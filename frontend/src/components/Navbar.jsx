import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Ticket, MessageCircle, ShoppingCart, User, Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Đặt vé', path: '/booking', icon: Ticket },
    { label: 'Trò chuyện', path: '/chat', icon: MessageCircle },
    { label: 'Giỏ hàng', path: '/cart', icon: ShoppingCart },
    { label: 'Tài khoản', path: '/profile', icon: User },
  ];

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
        <div className="hidden md:flex gap-8">
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-3xl md:hidden pt-24 px-8"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

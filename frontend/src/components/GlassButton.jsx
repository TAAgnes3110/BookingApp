import React from 'react';
import { motion } from 'framer-motion';

const GlassButton = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: "bg-primary hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    danger: "bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/20"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-button ${variants[variant] || variants.secondary} ${className}`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default GlassButton;

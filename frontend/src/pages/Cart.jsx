import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const discount = 0; // Placeholder
  const total = subtotal - discount;

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 px-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-white/20" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Giỏ hàng trống</h2>
        <p className="text-white/60 mb-8">Bạn chưa thêm dịch vụ nào vào giỏ hàng.</p>
        <Link to="/">
          <GlassButton variant="primary">Khám phá dịch vụ ngay</GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 md:px-8 max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-white mb-8">Giỏ hàng của bạn ({cartItems.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <GlassCard key={item.id} className="flex gap-4 items-center group relative overflow-hidden">
              {/* Check if image is URL or class name for backwards compatibility */}
              <div className={`w-24 h-24 rounded-lg flex-shrink-0 bg-white/10 overflow-hidden`}>
                {item.image && item.image.startsWith('http') ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full ${item.image}`} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate pr-8">{item.name}</h3>
                <p className="text-cyan-300 font-bold">${item.price}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-white/40 hover:text-red-400 transition-colors p-2 absolute top-2 right-2 md:static md:p-0"
                >
                  <Trash2 size={20} />
                </button>
                <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 mt-2 md:mt-0">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 text-white hover:bg-white/10 rounded disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white font-medium text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 text-white hover:bg-white/10 rounded"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="md:col-span-1">
          <GlassCard className="sticky top-28">
            <h3 className="text-xl font-bold text-white mb-4">Tóm tắt</h3>
            <div className="space-y-2 mb-6 text-white/70">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá</span>
                <span>-${discount}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10 text-white font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-cyan-300">${total}</span>
              </div>
            </div>
            <Link to="/payment">
              <GlassButton variant="primary" className="w-full justify-between">
                Thanh toán <ArrowRight size={18} />
              </GlassButton>
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Cart;

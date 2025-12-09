import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import { CreditCard, Truck, CheckCircle, Smartphone, ArrowRight, Home, Ticket, MapPin, Calendar, Users, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Payment = () => {
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const { getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle direct booking from ServiceDetail
  const directBooking = location.state;

  // Calculate pricing based on source (Cart or Direct Booking)
  const basePrice = directBooking ? directBooking.room.price : getCartTotal();
  // Assume a fixed 2 nights for demo if not specified
  const nights = 2;
  const roomTotal = basePrice * nights;

  const taxRate = 0.08; // 8% VAT
  const serviceFee = 150000; // Fixed fee
  const taxAmount = roomTotal * taxRate;

  const finalTotal = roomTotal + taxAmount + serviceFee - discountAmount;

  const handleApplyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toUpperCase() === 'WELCOME') {
      setDiscountAmount(200000);
      setAppliedCoupon('WELCOME');
      alert('Áp dụng mã giảm giá thành công!');
    } else {
      alert('Mã giảm giá không hợp lệ');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate API Booking Creation
    // In real app: POST /api/v1/bookings
    /*
      Payload: {
          property_id: ...,
          room_id: ...,
          check_in: ...,
          check_out: ...,
          coupon_code: appliedCoupon,
          payment_method: method
      }
    */

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);
    if (!directBooking) clearCart();
  };

  if (isSuccess) {
    return (
      <div className="pt-24 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg mx-auto">
        <GlassCard className="flex flex-col items-center p-8 w-full border-t-4 border-t-green-500">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-400 animate-in zoom-in duration-300">
            <CheckCircle size={56} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Đặt phòng thành công!</h2>
          <p className="text-white/60 mb-8 max-w-xs mx-auto">
            Mã đặt phòng của bạn là <span className="text-cyan-400 font-mono font-bold">BK-{Math.floor(Math.random() * 100000)}</span>.
            Thông tin chi tiết đã được gửi đến email.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <GlassButton variant="primary" className="w-full" onClick={() => navigate('/booking-history')}>
              <Ticket size={18} className="mr-2" /> Xem lịch sử đặt phòng
            </GlassButton>
            <GlassButton variant="secondary" className="w-full" onClick={() => navigate('/')}>
              <Home size={18} className="mr-2" /> Về trang chủ
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 md:px-8 max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Xác nhận thanh toán</h1>
        <p className="text-white/60">Vui lòng kiểm tra kỹ thông tin trước khi thanh toán.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: Booking Details & Payment Method */}
        <div className="lg:col-span-2 space-y-6">

          {/* Booking Item Summary */}
          <GlassCard>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-cyan-400" /> Thông tin đặt phòng
            </h3>

            {directBooking ? (
              <div className="flex gap-4">
                <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=200&q=80"
                  className="w-24 h-24 object-cover rounded-lg" alt="Room" />
                <div>
                  <h4 className="font-bold text-white text-lg">{directBooking.room.name}</h4>
                  <p className="text-cyan-400 text-sm mb-1">{directBooking.property?.title}</p>
                  <div className="text-white/60 text-sm space-y-1">
                    <p className="flex items-center gap-1"><Calendar size={14} /> 2 Đêm (15/12 - 17/12)</p>
                    <p className="flex items-center gap-1"><Users size={14} /> {directBooking.room.capacity} Người lớn</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/60 italic">Đang thanh toán cho giỏ hàng ({getCartTotal()} items)</div>
            )}
          </GlassCard>

          {/* Payment Methods */}
          <GlassCard>
            <h3 className="text-xl font-bold text-white mb-6">Phương thức thanh toán</h3>

            <div className="space-y-4">
              {/* ... Credit Card ... */}
              <div className={`rounded-xl border transition-all overflow-hidden cursor-pointer ${method === 'card' ? 'bg-white/10 border-cyan-400' : 'bg-transparent border-white/20 hover:bg-white/5'}`}
                onClick={() => setMethod('card')}>
                <div className="flex items-center gap-4 p-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300">
                    <CreditCard size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">Thẻ quốc tế</div>
                    <div className="text-sm text-white/50">Visa, Mastercard, JCB</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${method === 'card' ? 'border-cyan-400' : 'border-white/30'}`}>
                    {method === 'card' && <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>}
                  </div>
                </div>

                {method === 'card' && (
                  <div className="p-4 pt-0 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="col-span-2">
                      <GlassInput label="Số thẻ" placeholder="0000 0000 0000 0000" icon={CreditCard} />
                    </div>
                    <div>
                      <GlassInput label="Hết hạn" placeholder="MM/YY" />
                    </div>
                    <div>
                      <GlassInput label="CVC" placeholder="123" />
                    </div>
                    <div className="col-span-2">
                      <GlassInput label="Tên chủ thẻ" placeholder="NGUYEN VAN A" />
                    </div>
                  </div>
                )}
              </div>

              {/* VNPay / Momo */}
              <div className={`rounded-xl border transition-all overflow-hidden cursor-pointer ${method === 'vnpay' ? 'bg-white/10 border-cyan-400' : 'bg-transparent border-white/20 hover:bg-white/5'}`}
                onClick={() => setMethod('vnpay')}>
                <div className="flex items-center gap-4 p-4">
                  <div className="p-2 bg-red-500/20 rounded-lg text-red-300">
                    <Smartphone size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">VNPAY / QR Code</div>
                    <div className="text-sm text-white/50">Thanh toán qua ứng dụng ngân hàng</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${method === 'vnpay' ? 'border-cyan-400' : 'border-white/30'}`}>
                    {method === 'vnpay' && <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>}
                  </div>
                </div>
              </div>

              {/* Pay at hotel */}
              <div className={`rounded-xl border transition-all overflow-hidden cursor-pointer ${method === 'cod' ? 'bg-white/10 border-cyan-400' : 'bg-transparent border-white/20 hover:bg-white/5'}`}
                onClick={() => setMethod('cod')}>
                <div className="flex items-center gap-4 p-4">
                  <div className="p-2 bg-green-500/20 rounded-lg text-green-300">
                    <Home size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">Thanh toán tại khách sạn</div>
                    <div className="text-sm text-white/50">Giữ phòng và thanh toán khi Check-in</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${method === 'cod' ? 'border-cyan-400' : 'border-white/30'}`}>
                    {method === 'cod' && <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT: Price Summary */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-28">
            <h3 className="text-xl font-bold text-white mb-6">Chi tiết giá</h3>

            <div className="space-y-3 mb-6 text-white/80 text-sm">
              <div className="flex justify-between">
                <span>Giá phòng ({nights} đêm)</span>
                <span>{roomTotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế & Phí (8%)</span>
                <span>{taxAmount.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí dịch vụ</span>
                <span>{serviceFee.toLocaleString('vi-VN')}₫</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-400 font-medium">
                  <span>Mã giảm giá ({appliedCoupon})</span>
                  <span>-{discountAmount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}

              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-white text-lg">Tổng cộng</span>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-cyan-300">{finalTotal.toLocaleString('vi-VN')}₫</span>
                    <span className="text-xs text-white/40">Đã bao gồm thuế</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
              <label className="text-xs text-white/50 block mb-2">Mã giảm giá</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã"
                  className="bg-transparent text-white outline-none w-full text-sm uppercase"
                />
                <button onClick={handleApplyCoupon} className="text-cyan-400 text-xs font-bold hover:text-cyan-300">ÁP DỤNG</button>
              </div>
            </div>

            <GlassButton
              variant="primary"
              className="w-full justify-center py-4 text-lg"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2"><span className="animate-spin text-xl">⟳</span> Đang xử lý...</span>
              ) : (
                <>Thanh toán ngay <ArrowRight size={20} className="ml-2" /></>
              )}
            </GlassButton>

            <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> Thông tin được bảo mật 100%
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Payment;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import { CreditCard, Truck, CheckCircle, Smartphone, ArrowRight, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Payment = () => {
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const total = getCartTotal() + 5; // Adding $5 service fee

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="pt-24 px-4 flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
        <GlassCard className="flex flex-col items-center p-8 w-full">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-400">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Thanh toán thành công!</h2>
          <p className="text-white/60 mb-8">Cảm ơn bạn đã sử dụng dịch vụ của GlassBooking. Vé điện tử đã được gửi đến email của bạn.</p>
          <div className="flex gap-4 w-full">
            <GlassButton variant="primary" className="flex-1" onClick={() => navigate('/history')}>
              Xem vé đã đặt
            </GlassButton>
            <GlassButton variant="secondary" className="flex-1" onClick={() => navigate('/')}>
              <Home size={18} /> Trang chủ
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 md:px-8 max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-white mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard>
            <h3 className="text-xl font-bold text-white mb-6">Phương thức thanh toán</h3>

            <div className="space-y-4">
              {/* Credit Card Option */}
              <div className={`rounded-xl border transition-all overflow-hidden ${method === 'card' ? 'bg-white/10 border-cyan-400' : 'bg-transparent border-white/20 hover:bg-white/5'}`}>
                <label className="flex items-center gap-4 p-4 cursor-pointer">
                  <input type="radio" name="payment" value="card" checked={method === 'card'} onChange={() => setMethod('card')} className="hidden" />
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300">
                    <CreditCard size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">Thẻ tín dụng / Ghi nợ</div>
                    <div className="text-sm text-white/50">Visa, Mastercard, JCB</div>
                  </div>
                  {method === 'card' && <CheckCircle className="text-cyan-400" />}
                </label>

                {method === 'card' && (
                  <div className="p-4 pt-0 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
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

              {/* Momo Option */}
              <div className={`rounded-xl border transition-all overflow-hidden ${method === 'momo' ? 'bg-white/10 border-cyan-400' : 'bg-transparent border-white/20 hover:bg-white/5'}`}>
                <label className="flex items-center gap-4 p-4 cursor-pointer">
                  <input type="radio" name="payment" value="momo" checked={method === 'momo'} onChange={() => setMethod('momo')} className="hidden" />
                  <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                    <Smartphone size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">Ví MoMo</div>
                    <div className="text-sm text-white/50">Quét mã QR để thanh toán</div>
                  </div>
                  {method === 'momo' && <CheckCircle className="text-cyan-400" />}
                </label>
                {method === 'momo' && (
                  <div className="p-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white p-2 rounded-xl mb-4">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePayment" alt="Momo QR" className="w-32 h-32" />
                    </div>
                    <p className="text-white/70 text-sm">Mở ứng dụng MoMo và quét mã để thanh toán</p>
                  </div>
                )}
              </div>

              {/* COD Option */}
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${method === 'cod' ? 'bg-white/20 border-cyan-400' : 'bg-transparent border-white/20 hover:bg-white/5'}`}>
                <input type="radio" name="payment" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} className="hidden" />
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                  <Truck size={24} />
                </div>
                <div>
                  <div className="font-semibold text-white">Thanh toán tại chỗ (COD)</div>
                  <div className="text-sm text-white/50">Thanh toán khi sử dụng dịch vụ</div>
                </div>
                {method === 'cod' && <CheckCircle className="ml-auto text-cyan-400" />}
              </label>
            </div>
          </GlassCard>
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <GlassCard className="sticky top-28">
            <h3 className="text-xl font-bold text-white mb-6">Tổng đơn hàng</h3>
            <div className="space-y-4 mb-6 text-white/80">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>${getCartTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí dịch vụ</span>
                <span>$5.00</span>
              </div>
              <div className="flex justify-between font-bold text-white text-lg pt-4 border-t border-white/20">
                <span>Tổng cộng</span>
                <span className="text-cyan-300">${total}</span>
              </div>
            </div>
            <GlassButton
              variant="primary"
              className="w-full justify-center relative"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="animate-pulse">Đang xử lý...</span>
              ) : (
                <>Thanh toán ngay <ArrowRight size={18} className="ml-2 inline" /></>
              )}
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Payment;

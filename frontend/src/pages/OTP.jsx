import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <GlassCard className="w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Xác thực OTP</h2>
        <p className="text-white/60 mb-8">
          Mã xác thực đã được gửi đến email <span className="text-white font-semibold">nam@example.com</span>
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {otp.map((data, index) => (
            <input
              className="w-12 h-14 rounded-xl border border-white/20 bg-white/10 text-center text-white text-xl font-bold focus:bg-white/20 focus:border-cyan-400 outline-none transition-all"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <GlassButton variant="primary" className="w-full mb-4">
          Xác nhận
        </GlassButton>

        <p className="text-white/60 text-sm">
          Chưa nhận được mã?{' '}
          <button className="text-cyan-300 font-semibold hover:text-cyan-200">
            Gửi lại
          </button>
        </p>
      </GlassCard>
    </div>
  );
};

export default OTP;

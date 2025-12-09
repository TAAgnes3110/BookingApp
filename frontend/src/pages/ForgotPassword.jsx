import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassInput from '../components/GlassInput';
import GlassButton from '../components/GlassButton';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <GlassCard className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/login" className="text-white/60 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={18} /> Quay lại
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Quên mật khẩu?</h2>
          <p className="text-white/60">Đừng lo, hãy nhập email để lấy lại mật khẩu nhé</p>
        </div>

        <form>
          <GlassInput
            label="Email đăng ký"
            type="email"
            placeholder="nam@example.com"
            icon={Mail}
          />

          <GlassButton variant="primary" className="w-full mb-4">
            Gửi mã OTP
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  );
};

export default ForgotPassword;

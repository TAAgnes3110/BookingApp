import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassInput from '../components/GlassInput';
import GlassButton from '../components/GlassButton';
import { User, Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.username, formData.password, formData.phone);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <GlassCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Tạo tài khoản</h2>
          <p className="text-slate-400">Bắt đầu hành trình của bạn ngay hôm nay</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <GlassInput
            label="Họ và tên"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            icon={User}
            required
          />
          <GlassInput
            label="Tên đăng nhập"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="user123"
            icon={User}
            required
          />
          <GlassInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nam@example.com"
            icon={Mail}
            required
          />
          <GlassInput
            label="Số điện thoại"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0912..."
            icon={Phone}
            required
          />
          <GlassInput
            label="Mật khẩu"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            required
          />
          <GlassInput
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <GlassButton type="submit" variant="primary" className="w-full mt-6 mb-4" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
          </GlassButton>
        </form>

        <div className="text-center text-slate-400 text-sm">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary font-semibold hover:text-sky-300">
            Đăng nhập
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassInput from '../components/GlassInput';
import GlassButton from '../components/GlassButton';
import { Mail, Lock, Facebook, Chrome, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithSocial } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(identifier, password);
      // Check role to redirect
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
          setIsLoading(true);
          try {
              await loginWithSocial(tokenResponse.access_token, 'google');
              navigate('/profile');
          } catch (err) {
              setError('Đăng nhập Google thất bại');
          } finally {
              setIsLoading(false);
          }
      },
      onError: () => setError('Google Login Failed'),
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center gap-4">
      <GlassCard className="w-full max-w-md relative">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại</h2>
            <p className="text-slate-400">Đăng nhập để tiếp tục khám phá</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
            <AlertCircle size={16} />
            {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6">
            <GlassInput
                label="Email hoặc Tên đăng nhập"
                type="text"
                placeholder="nam@example.com hoặc nam123"
                icon={Mail}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
            />
            <GlassInput
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <div className="flex justify-end mb-6">
                <Link to="/forgot-password" className="text-sm text-primary hover:text-sky-300 transition-colors">
                Quên mật khẩu?
                </Link>
            </div>

            <GlassButton type="submit" variant="primary" className="w-full mb-4" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </GlassButton>
        </form>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 text-slate-400 bg-transparent">Hoặc đăng nhập với</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* Facebook Button - Safe Render */}
            {import.meta.env.VITE_FACEBOOK_APP_ID && import.meta.env.VITE_FACEBOOK_APP_ID !== "YOUR_FACEBOOK_APP_ID" ? (
                <FacebookLogin
                    appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                    onSuccess={async (response) => {
                        setIsLoading(true);
                        try {
                            await loginWithSocial(response.accessToken, 'facebook');
                            navigate('/profile');
                        } catch (err) {
                            setError('Đăng nhập Facebook thất bại');
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    onFail={(error) => console.log('Facebook Login Failed!', error)}
                    render={({ onClick }) => (
                        <GlassButton
                            variant="secondary"
                            className="!px-4 justify-center"
                            onClick={onClick}
                            disabled={isLoading}
                        >
                            <Facebook size={20} className="text-blue-500" /> Facebook
                        </GlassButton>
                    )}
                />
            ) : (
                <div className="text-xs text-center text-slate-500 col-span-1 border border-white/5 rounded p-2">
                    Cần FB App ID
                </div>
            )}

            {/* Google Button - Safe Render */}
            {import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID" ? (
                <GlassButton
                    variant="secondary"
                    className="!px-4 justify-center"
                    onClick={() => googleLogin()}
                    disabled={isLoading}
                >
                    <Chrome size={20} className="text-red-500" /> Google
                </GlassButton>
            ) : (
                <div className="text-xs text-center text-slate-500 col-span-1 border border-white/5 rounded p-2">
                    Cần Google Client ID
                </div>
            )}
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary font-semibold hover:text-sky-300">
            Đăng ký ngay
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default Login;

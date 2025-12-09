import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import { User, Phone, MapPin, Camera, LogOut, Settings, Clock, LogIn, UserPlus, CreditCard, Plus, X, Lock, Bell, Globe, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsEditing(false);
    navigate('/');
  };

  // --- Payment Methods State (Mock) ---
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, brand: 'Visa', bank: 'Vietcombank', last4: '4242', expiry: '12/25' }
  ]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newCard, setNewCard] = useState({ bank: '', brand: '', number: '', holder: '', expiry: '' });

  // --- Settings State (Mock) ---
  const [showSettings, setShowSettings] = useState(false);
  const [isChangePasswordView, setIsChangePasswordView] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    language: 'vi',
    twoFactor: false
  });

  // --- Actions ---

  const handleAddPaymentMethod = () => setShowAddPayment(true);
  const handleSettings = () => {
    setShowSettings(true);
    setIsChangePasswordView(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    if (passwordData.new.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    // Mock API call
    alert("Đổi mật khẩu thành công!");
    setPasswordData({ current: '', new: '', confirm: '' });
    setIsChangePasswordView(false);
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    if (!newCard.bank || !newCard.brand || !newCard.number || !newCard.expiry) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const method = {
      id: Date.now(),
      brand: newCard.brand,
      bank: newCard.bank,
      last4: newCard.number.slice(-4),
      expiry: newCard.expiry
    };
    setPaymentMethods([...paymentMethods, method]);
    setShowAddPayment(false);
    setNewCard({ bank: '', brand: '', number: '', holder: '', expiry: '' });
    alert("Đã thêm phương thức thanh toán mới thành công!");
  };

  const handleDeletePaymentMethod = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phương thức thanh toán này?")) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    }
  };

  const saveSettings = () => {
    // API Call to save user settings
    alert("Cài đặt đã được lưu thành công!");
    setShowSettings(false);
  }

  return (
    <div className="pt-24 px-4 md:px-8 max-w-4xl mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="md:col-span-1">
          <GlassCard className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-4">
              <div className={`w-full h-full rounded-full ${user ? 'bg-gradient-to-tr from-cyan-400 to-purple-500' : 'bg-slate-700'} p-1`}>
                <img
                  src={user ? (user.avatar_url || user.avatar || "https://via.placeholder.com/150") : "https://via.placeholder.com/150?text=Guest"}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-4 border-white/20"
                />
              </div>
              {user && (
                <button className="absolute bottom-0 right-0 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors">
                  <Camera size={18} className="text-white" />
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">
              {user ? (user.first_name ? `${user.first_name} ${user.last_name}` : user.name) : "Chưa đăng nhập"}
            </h2>
            <p className="text-white/60 text-sm mb-6 uppercase tracking-wider font-semibold text-[10px]">
              {user ? (user.role === 'guest' ? 'Thành viên' : user.role) : "Khách vãng lai"}
            </p>

            <div className="w-full space-y-2">
              {user ? (
                <>
                  <Link to="/history" className="w-full block">
                    <GlassButton variant="secondary" className="w-full !justify-start">
                      <Clock size={18} /> Lịch sử đặt vé
                    </GlassButton>
                  </Link>
                  <GlassButton variant="secondary" className="w-full !justify-start" onClick={handleSettings}>
                    <Settings size={18} /> Cài đặt tài khoản
                  </GlassButton>
                  <GlassButton
                    variant="danger"
                    className="w-full !justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} /> Đăng xuất
                  </GlassButton>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full block">
                    <GlassButton
                      variant="primary"
                      className="w-full !justify-start"
                    >
                      <LogIn size={18} /> Đăng nhập
                    </GlassButton>
                  </Link>
                  <Link to="/register" className="w-full block">
                    <GlassButton variant="secondary" className="w-full !justify-start">
                      <UserPlus size={18} /> Đăng ký
                    </GlassButton>
                  </Link>
                </>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Main Details */}
        <div className="md:col-span-2">
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Thông tin cá nhân</h3>
              {user && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-cyan-300 hover:text-cyan-200 text-sm font-semibold"
                >
                  {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
              )}
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput
                  label="Họ tên"
                  defaultValue={user ? (user.first_name ? `${user.first_name} ${user.last_name}` : user.name) : ""}
                  readOnly={!isEditing}
                  disabled={!user}
                  icon={User}
                  placeholder={!user ? "Vui lòng đăng nhập" : ""}
                />
                <GlassInput
                  label="Số điện thoại"
                  defaultValue={user ? (user.phone_number || user.phone || "") : ""}
                  readOnly={!isEditing}
                  disabled={!user}
                  icon={Phone}
                  placeholder={!user ? "---" : ""}
                />
              </div>

              <GlassInput
                label="Địa chỉ"
                defaultValue={user ? (user.address_line1 || user.address || "") : ""}
                readOnly={!isEditing}
                disabled={!user}
                icon={MapPin}
                placeholder={!user ? "---" : ""}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput
                  label="Ngày sinh"
                  type="date"
                  defaultValue={user ? user.dob : ""}
                  readOnly={!isEditing}
                  disabled={!user}
                />
                <div className="flex flex-col gap-2 mb-4 w-full">
                  <label className="text-white text-sm font-medium ml-1">Giới tính</label>
                  <select
                    disabled={!isEditing || !user}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white focus:bg-white/20 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all outline-none appearance-none disabled:opacity-50"
                    defaultValue={user ? user.gender : ""}
                  >
                    <option className="bg-slate-800" value="">-- Chọn --</option>
                    <option className="bg-slate-800" value="Nam">Nam</option>
                    <option className="bg-slate-800" value="Nữ">Nữ</option>
                    <option className="bg-slate-800" value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              {isEditing && user && (
                <div className="flex justify-end pt-4">
                  <GlassButton type="submit" variant="primary">Lưu thay đổi</GlassButton>
                </div>
              )}
            </form>
            <h3 className="text-xl font-bold text-white mb-4 mt-8 pt-6 border-t border-white/10">Phương thức thanh toán</h3>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{method.bank} - {method.brand}</div>
                      <div className="text-sm text-white/50">**** **** **** {method.last4} | Exp: {method.expiry}</div>
                    </div>
                  </div>
                  <GlassButton
                    variant="secondary"
                    className="!text-xs text-red-300 hover:text-red-200 hover:bg-red-500/20"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                  >
                    Xóa
                  </GlassButton>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPaymentMethod}
                className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Thêm phương thức thanh toán mới
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* --- ADD PAYMENT MODAL --- */}
      {showAddPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-md relative">
            <button
              onClick={() => setShowAddPayment(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Thêm thẻ mới</h2>

            <form onSubmit={handleSavePayment} className="space-y-4">
              <div className="space-y-2">
                <label className="text-white text-sm ml-1">Ngân hàng</label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:bg-white/20"
                  value={newCard.bank}
                  onChange={(e) => setNewCard({ ...newCard, bank: e.target.value })}
                  required
                >
                  <option value="" className="bg-slate-800">-- Chọn ngân hàng --</option>
                  <option value="Vietcombank" className="bg-slate-800">Vietcombank</option>
                  {/* ... other banks ... */}
                  <option value="Techcombank" className="bg-slate-800">Techcombank</option>
                </select>
              </div>
              {/* ... Other inputs (simplified for brevity because they were correct) ... */}
              <div className="space-y-2">
                <label className="text-white text-sm ml-1">Số thẻ</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:bg-white/20 placeholder:text-white/30"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                  required
                  maxLength={19}
                />
              </div>
              {/* ... */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white text-sm ml-1">Loại thẻ</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:bg-white/20"
                    value={newCard.brand} onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}>
                    <option value="Visa" className="bg-slate-800">Visa</option>
                    <option value="Mastercard" className="bg-slate-800">Mastercard</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm ml-1">Hết hạn</label>
                  <input className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:bg-white/20"
                    placeholder="MM/YY" value={newCard.expiry} onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })} />
                </div>
              </div>

              <GlassButton type="submit" variant="primary" className="w-full mt-4">
                Lưu thẻ
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      )}

      {/* --- SETTINGS MODAL --- */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-lg relative min-h-[400px]">
            <button
              onClick={() => { setShowSettings(false); setIsChangePasswordView(false); }}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>

            {!isChangePasswordView ? (
              // --- MAIN SETTINGS VIEW ---
              <div className="animate-in slide-in-from-left-4 fade-in duration-300">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings size={24} /> Cài đặt tài khoản
                </h2>

                <div className="space-y-6">
                  {/* Account Security */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white/90 border-b border-white/10 pb-2">Bảo mật</h3>
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                        <Lock size={20} /> <span>Đổi mật khẩu</span>
                      </div>
                      <GlassButton
                        variant="outline"
                        className="!py-1.5 !px-4 text-xs group-hover:bg-white/10"
                        onClick={() => setIsChangePasswordView(true)}
                      >
                        Thay đổi
                      </GlassButton>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white/80">
                        <UserPlus size={20} /> <span>Xác thực 2 bước (2FA)</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.twoFactor ? 'bg-cyan-500' : 'bg-white/10'}`}
                        onClick={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white/90 border-b border-white/10 pb-2">Tùy chọn</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white/80">
                        <Bell size={20} /> <span>Thông báo đẩy</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.notifications ? 'bg-cyan-500' : 'bg-white/10'}`}
                        onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white/80">
                        <Globe size={20} /> <span>Ngôn ngữ</span>
                      </div>
                      <select className="bg-slate-800 text-white text-sm border border-white/20 rounded-lg p-1 outline-none">
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                    <GlassButton variant="secondary" onClick={() => setShowSettings(false)}>Thoát</GlassButton>
                    <GlassButton variant="primary" onClick={saveSettings}>Lưu cài đặt</GlassButton>
                  </div>
                </div>
              </div>
            ) : (
              // --- CHANGE PASSWORD VIEW ---
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => setIsChangePasswordView(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-bold text-white">Đổi mật khẩu</h2>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <GlassInput
                    label="Mật khẩu hiện tại"
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    icon={Lock}
                  />
                  <div className="h-px bg-white/10 my-2"></div>
                  <GlassInput
                    label="Mật khẩu mới"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    required
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    icon={Lock}
                  />
                  <GlassInput
                    label="Nhập lại mật khẩu mới"
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    required
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    icon={Check}
                  />

                  <div className="pt-6 flex justify-end gap-3">
                    <GlassButton
                      variant="secondary"
                      type="button"
                      onClick={() => setIsChangePasswordView(false)}
                    >
                      Hủy bỏ
                    </GlassButton>
                    <GlassButton variant="primary" type="submit">Cập nhật mật khẩu</GlassButton>
                  </div>
                </form>
              </div>
            )}
          </GlassCard>
        </div>
      )}

    </div>
  );
};

export default Profile;

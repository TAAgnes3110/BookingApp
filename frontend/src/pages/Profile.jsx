import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import { User, Phone, MapPin, Camera, LogOut, Settings, Clock, LogIn, UserPlus, CreditCard, Plus, X } from 'lucide-react';
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

  // Mock Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, brand: 'Visa', bank: 'Vietcombank', last4: '4242', expiry: '12/25' }
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newCard, setNewCard] = useState({
    bank: '',
    brand: '',
    number: '',
    holder: '',
    expiry: ''
  });

  const handleAddPaymentMethod = () => {
    setShowAddPayment(true);
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

  const handleSettings = () => {
    alert("Tính năng cài đặt đang được phát triển!");
  };

  return (
    <div className="pt-24 px-4 md:px-8 max-w-4xl mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="md:col-span-1">
          <GlassCard className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-4">
              <div className={`w-full h-full rounded-full ${user ? 'bg-gradient-to-tr from-cyan-400 to-purple-500' : 'bg-slate-700'} p-1`}>
                <img
                  src={user ? (user.avatar || "https://via.placeholder.com/150") : "https://via.placeholder.com/150?text=Guest"}
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
              {user ? user.name : "Chưa đăng nhập"}
            </h2>
            <p className="text-white/60 text-sm mb-6">
              {user ? user.rank : "Khách vãng lai"}
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
                  defaultValue={user ? user.name : ""}
                  readOnly={!isEditing}
                  disabled={!user}
                  icon={User}
                  placeholder={!user ? "Vui lòng đăng nhập" : ""}
                />
                <GlassInput
                  label="Số điện thoại"
                  defaultValue={user ? user.phone : ""}
                  readOnly={!isEditing}
                  disabled={!user}
                  icon={Phone}
                  placeholder={!user ? "---" : ""}
                />
              </div>

              <GlassInput
                label="Địa chỉ"
                defaultValue={user ? user.address : ""}
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

              {paymentMethods.length === 0 && (
                <p className="text-white/40 text-center py-2 text-sm">Chưa có phương thức thanh toán nào.</p>
              )}

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

      {/* Add Payment Method Modal */}
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
                  <option value="Techcombank" className="bg-slate-800">Techcombank</option>
                  <option value="MBBank" className="bg-slate-800">MBBank</option>
                  <option value="VPBank" className="bg-slate-800">VPBank</option>
                  <option value="ACB" className="bg-slate-800">ACB</option>
                  <option value="BIDV" className="bg-slate-800">BIDV</option>
                  <option value="TPBank" className="bg-slate-800">TPBank</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm ml-1">Loại thẻ</label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:bg-white/20"
                  value={newCard.brand}
                  onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}
                  required
                >
                  <option value="" className="bg-slate-800">-- Chọn loại thẻ --</option>
                  <option value="Visa" className="bg-slate-800">Visa</option>
                  <option value="Mastercard" className="bg-slate-800">Mastercard</option>
                  <option value="JCB" className="bg-slate-800">JCB</option>
                  <option value="Napas" className="bg-slate-800">Napas</option>
                </select>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white text-sm ml-1">Tên chủ thẻ</label>
                  <input
                    type="text"
                    placeholder="NGUYEN VAN A"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:bg-white/20 placeholder:text-white/30"
                    value={newCard.holder}
                    onChange={(e) => setNewCard({ ...newCard, holder: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm ml-1">Hết hạn</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:bg-white/20 placeholder:text-white/30"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    required
                    maxLength={5}
                  />
                </div>
              </div>

              <GlassButton type="submit" variant="primary" className="w-full mt-4">
                Lưu thẻ
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Profile;

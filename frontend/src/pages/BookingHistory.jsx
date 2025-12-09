import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Calendar, MapPin, Clock, MoreHorizontal, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock Data for Development corresponding to new Schema
  const mockBookings = [
    {
      id: 'BK-20231209-X8Z1',
      property_name: "Luxury Ocean Resort & Spa",
      room_name: "Deluxe Ocean View",
      check_in: "2023-12-24",
      check_out: "2023-12-26",
      status: "success",
      total_price: 3200000,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      address: "Da Nang, Vietnam"
    },
    {
      id: 'BK-20231115-A2B3',
      property_name: "Hanoi Old Quarter Hotel",
      room_name: "Standard Double",
      check_in: "2023-11-15",
      check_out: "2023-11-16",
      status: "cancelled",
      total_price: 850000,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      address: "Hanoi, Vietnam"
    },
    {
      id: 'BK-20231020-C9D8',
      property_name: "Sapa Mountain Retreat",
      room_name: "Bungalow",
      check_in: "2023-10-20",
      check_out: "2023-10-22",
      status: "pending",
      total_price: 2500000,
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      address: "Sapa, Laos Cai"
    },
  ];

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'success': return { color: 'text-green-400 bg-green-400/10 border-green-400/20', label: 'Đã hoàn thành', icon: CheckCircle };
      case 'cancelled': return { color: 'text-red-400 bg-red-400/10 border-red-400/20', label: 'Đã hủy', icon: XCircle };
      case 'pending': return { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', label: 'Chờ thanh toán', icon: AlertCircle };
      default: return { color: 'text-white/60 bg-white/10', label: status, icon: MoreHorizontal };
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center text-white">Đang tải lịch sử...</div>;

  return (
    <div className="pt-24 px-4 md:px-8 max-w-6xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-white mb-2">Lịch sử đặt phòng</h1>
      <p className="text-white/60 mb-8">Quản lý và xem lại các chuyến đi của bạn</p>

      <div className="space-y-6">
        {bookings.map((item) => {
          const statusInfo = getStatusInfo(item.status);
          const StatusIcon = statusInfo.icon;

          return (
            <GlassCard key={item.id} className="group hover:border-white/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-48 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img
                    src={item.image}
                    alt={item.property_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 md:hidden">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${statusInfo.color} backdrop-blur-md`}>
                      <StatusIcon size={12} /> {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors cursor-pointer">{item.property_name}</h3>
                        <p className="text-cyan-400 text-sm font-medium">{item.room_name}</p>
                      </div>
                      <div className="hidden md:block">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${statusInfo.color}`}>
                          <StatusIcon size={14} /> {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-white/60 text-sm mb-4">
                      <span className="flex items-center gap-2"><Calendar size={16} className="text-white/40" /> {item.check_in} - {item.check_out}</span>
                      <span className="flex items-center gap-2"><MapPin size={16} className="text-white/40" /> {item.address}</span>
                      <span className="flex items-center gap-2 font-mono text-xs"><FileText size={16} className="text-white/40" /> ID: {item.id}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-4 mt-2 gap-4">
                    <div className="text-center md:text-left w-full md:w-auto">
                      <span className="block text-xs text-white/40 mb-1">Tổng thanh toán</span>
                      <span className="text-xl font-bold text-cyan-300">{item.total_price.toLocaleString('vi-VN')}₫</span>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      {item.status === 'success' && (
                        <>
                          <GlassButton variant="outline" className="flex-1 md:flex-none text-sm py-2">Đánh giá</GlassButton>
                          <GlassButton variant="primary" className="flex-1 md:flex-none text-sm py-2">Đặt lại</GlassButton>
                        </>
                      )}
                      {item.status === 'pending' && (
                        <GlassButton className="flex-1 md:flex-none text-sm py-2 bg-yellow-500/80 hover:bg-yellow-500 text-white border-none">Thanh toán ngay</GlassButton>
                      )}
                      {item.status === 'cancelled' && (
                        <span className="text-white/40 text-sm italic py-2 px-4">Đã bị hủy vào 15/11/2023</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default BookingHistory;

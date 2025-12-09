import React from 'react';
import GlassCard from '../components/GlassCard';
import { Calendar, MapPin, Clock, MoreHorizontal } from 'lucide-react';

const BookingHistory = () => {
  // Mock Data
  const history = [
    { id: 101, name: "Resort Ven Biển Cao Cấp", date: "12/12/2023", status: "Đã hoàn thành", price: "$240", image: "bg-blue-500" },
    { id: 102, name: "Tour Leo Núi Mạo Hiểm", date: "05/11/2023", status: "Đã hủy", price: "$85", image: "bg-green-500" },
    { id: 103, name: "Spa Thư Giãn Thiên Nhiên", date: "20/10/2023", status: "Đã hoàn thành", price: "$50", image: "bg-purple-500" },
  ];

  const getStatusColor = (status) => {
    if (status === 'Đã hoàn thành') return 'text-green-400 bg-green-400/10';
    if (status === 'Đã hủy') return 'text-red-400 bg-red-400/10';
    return 'text-yellow-400 bg-yellow-400/10';
  };

  return (
    <div className="pt-24 px-4 md:px-8 max-w-5xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-white mb-8">Lịch sử đặt vé</h1>

      <div className="space-y-4">
        {history.map((item) => (
          <GlassCard key={item.id} className="flex flex-col md:flex-row items-center gap-6">
            <div className={`w-full md:w-32 h-32 rounded-xl ${item.image} bg-opacity-50 flex-shrink-0`} />

            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-4 text-white/60 text-sm mb-4 justify-center md:justify-start">
                <span className="flex items-center gap-1 justify-center md:justify-start"><Calendar size={16} /> {item.date}</span>
                <span className="flex items-center gap-1 justify-center md:justify-start"><Clock size={16} /> 2 Ngày 1 Đêm</span>
                <span className="flex items-center gap-1 justify-center md:justify-start"><MapPin size={16} /> Vietnam</span>
              </div>

              <div className="flex justify-between items-center md:justify-start md:gap-8 border-t border-white/10 pt-4 md:border-t-0 md:pt-0">
                <div className="text-left">
                  <span className="block text-xs text-white/40">Tổng tiền</span>
                  <span className="text-lg font-bold text-cyan-300">{item.price}</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors border border-white/10">Đặt lại</button>
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors border border-white/10">Đánh giá</button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;

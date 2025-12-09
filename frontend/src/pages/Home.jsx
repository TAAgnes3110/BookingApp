import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Sparkles, MapPin, Calendar } from 'lucide-react';

const Home = () => {
  // Defines images for the loop since map index is simple
  const images = [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Resort
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Mountain
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"  // Beach
  ];
  return (
    <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          Khám phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">Thế giới Mới</span>
        </h1>
        <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Trải nghiệm đặt vé và du lịch theo phong cách Glassmorphism. Đẳng cấp, tinh tế và mượt mà.
        </p>
        <div className="flex justify-center gap-4">
          <GlassButton variant="primary">Đặt vé ngay</GlassButton>
          <GlassButton variant="secondary">Tìm hiểu thêm</GlassButton>
        </div>
      </section>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {[1, 2, 3].map((item, index) => (
          <Link to={`/service/${item}`} key={item}>
            <GlassCard className="h-full hover:bg-white/10 transition-colors cursor-pointer group !p-4">
              <div className="h-48 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 mb-6 flex items-center justify-center group-hover:scale-[1.02] transition-transform overflow-hidden relative">
                <img
                  src={images[index]}
                  alt={`Trip ${item}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Chuyến đi Đặc Biệt {item}</h3>
              <div className="flex items-center gap-2 text-white/70 mb-4 text-sm">
                <MapPin size={16} /> Vietnam
                <span className="mx-2">•</span>
                <Calendar size={16} /> 3 Ngày 2 Đêm
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-cyan-300">$299</span>
                <GlassButton variant="secondary" className="!px-4 !py-2 text-sm">Chi tiết</GlassButton>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

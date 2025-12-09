import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import { Search, MapPin, Filter, Star } from 'lucide-react';

const BookingList = () => {
  // Mock Data
  const services = [
    { id: 1, name: "Resort Ven Biển Cao Cấp", location: "Đà Nẵng", price: "$120", rating: 4.8, image: "bg-blue-500" },
    { id: 2, name: "Tour Leo Núi Mạo Hiểm", location: "Sapa", price: "$85", rating: 4.5, image: "bg-green-500" },
    { id: 3, name: "Spa Thư Giãn Thiên Nhiên", location: "Đà Lạt", price: "$50", rating: 4.9, image: "bg-purple-500" },
    { id: 4, name: "Khách Sạn Kính Trên Mây", location: "Hà Nội", price: "$200", rating: 4.7, image: "bg-indigo-500" },
  ];

  return (
    <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-12">
      {/* Search Filter Bar */}
      <GlassCard className="mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <GlassInput icon={Search} placeholder="Tìm kiếm dịch vụ, địa điểm..." className="!mb-0" />
        </div>
        <div className="w-full md:w-1/4">
          <GlassInput icon={MapPin} placeholder="Vị trí" className="!mb-0" />
        </div>
        <div className="w-full md:w-auto">
          <GlassButton variant="secondary" className="h-[50px] w-full md:w-auto">
            <Filter size={20} /> Lọc
          </GlassButton>
        </div>
      </GlassCard>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Link to={`/service/${service.id}`} key={service.id}>
            <GlassCard className="group cursor-pointer hover:bg-white/10 transition-colors h-full">
              <div className={`h-40 rounded-xl mb-4 ${service.image} bg-opacity-50 flex items-center justify-center`}>
                <span className="text-white/30 text-4xl font-bold">{service.name[0]}</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight mb-1">{service.name}</h3>
                  <div className="flex items-center text-white/60 text-sm">
                    <MapPin size={14} className="mr-1" /> {service.location}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center text-yellow-400 gap-1 font-bold text-sm">
                  <Star size={16} fill="currentColor" /> {service.rating}
                </div>
                <span className="text-xl font-bold text-cyan-300">{service.price}</span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookingList;

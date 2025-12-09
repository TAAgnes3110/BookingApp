import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { MapPin, Star, Clock, Share2, Heart, ArrowLeft, ShoppingCart, User, Users, Check, AlertCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios'; // We'll assume axios is set up or use fetch

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock blocked dates (some random days in current/next month)
  const today = new Date();
  const blockedDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString().split('T')[0],
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10).toISOString().split('T')[0],
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const isBooked = (date) => {
    if (!date) return false;
    const str = date.toISOString().split('T')[0];
    return blockedDates.includes(str);
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  }

  const handleDateClick = (date) => {
    if (date && !isBooked(date)) {
      setSelectedDate(date);
    }
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2"><Calendar size={18} className="text-cyan-400" /> Lịch trống</h3>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="p-1 rounded hover:bg-white/10 text-white"><ChevronLeft size={16} /></button>
          <span className="text-white text-sm font-medium w-24 text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 rounded hover:bg-white/10 text-white"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
          <div key={d} className="text-[10px] text-white/50 uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => (
          <div key={idx} className="aspect-square">
            {date ? (
              <button
                onClick={() => handleDateClick(date)}
                disabled={isBooked(date)}
                className={`w-full h-full rounded-md flex items-center justify-center text-xs transition-colors
                  ${isBooked(date) ? 'bg-red-500/20 text-red-500 cursor-not-allowed line-through' :
                    isSelected(date) ? 'bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/50' :
                      'bg-white/5 text-white hover:bg-white/20'
                  }
                `}
              >
                {date.getDate()}
              </button>
            ) : <div />}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-white/60 justify-center">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500/50"></div> Đã đặt</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> Đang chọn</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/20"></div> Trống</div>
      </div>
    </GlassCard>
  );
};

const ServiceDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data fallback if API fails (for development visualisation)
  const mockProperty = {
    id: id,
    title: "Luxury Ocean Resort & Spa",
    host_id: "host_123", // Added host_id
    address_full: "123 Coastal Highway, Da Nang",
    rating_avg: 4.8,
    review_count: 124,
    description: "Experience world-class service at our luxury resort. Featuring private beaches, infinity pools, and exquisite dining options.",
    check_in_time: "14:00",
    check_out_time: "12:00",
    images: [
      { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
    ],
    amenities: [
      { name: "Wifi", type: "general" }, { name: "Pool", type: "general" }, { name: "Spa", type: "general" }, { name: "Parking", type: "general" }, { name: "AC", type: "general" }
    ],
    rooms: [
      { id: 'r1', name: "Deluxe Ocean View", price: 1500000, capacity: 2, size_sqm: 45, quantity: 5, description: "Spacious room with breathtaking ocean views and king-size bed." },
      { id: 'r2', name: "Executive Suite", price: 2500000, capacity: 2, size_sqm: 65, quantity: 3, description: "Luxury suite with separate living area and premium amenities." },
      { id: 'r3', name: "Family Villa", price: 4500000, capacity: 4, size_sqm: 120, quantity: 1, description: "Private villa with pool access, perfect for families." }
    ]
  };

  useEffect(() => {
    // Simulate API fetch
    // In real implementation: axios.get(`/api/v1/properties/${id}`)
    setTimeout(() => {
      setProperty(mockProperty);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleAddToCart = (room) => {
    addToCart({
      id: room.id,
      propertyId: property.id,
      name: `${property.title} - ${room.name}`,
      price: room.price,
      image: property.images[0]?.url,
      type: 'room_booking'
    });
    // navigate('/cart'); // Optional: stay on page or go to cart
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center text-white">Property not found</div>;

  return (
    <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-12">
      <Link to="/booking" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Quay lại danh sách
      </Link>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Gallery */}
          <GlassCard className="!p-2 overflow-hidden">
            <div className="h-[400px] rounded-xl relative group">
              <img
                src={property.images[selectedImage]?.url || "https://via.placeholder.com/800x600"}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Dots indicators could go here */}
              </div>
            </div>
          </GlassCard>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {property.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-24 h-20 rounded-lg flex-shrink-0 border-2 transition-all p-0.5 overflow-hidden ${selectedImage === index ? 'border-cyan-400 scale-105 shadow-glow-cyan' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover rounded-md" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Info & Map Placeholder */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-bold text-white leading-tight">{property.title}</h1>
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                <Heart size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-white/70 mb-4 text-sm">
              <MapPin size={16} className="text-cyan-400" />
              <span>{property.address_full}</span>
            </div>

            <div className="flex items-center gap-4 text-white/90 mb-6">
              <span className="flex items-center gap-1 bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-md font-bold text-sm">
                <Star size={14} fill="currentColor" /> {property.rating_avg}
              </span>
              <span className="text-sm text-white/50">({property.review_count} đánh giá)</span>
            </div>

            <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-white/5 rounded-lg">
                <span className="block text-xs text-white/50 mb-1">Check-in</span>
                <span className="font-semibold text-white">{property.check_in_time}</span>
              </div>
              <div className="text-center p-2 bg-white/5 rounded-lg">
                <span className="block text-xs text-white/50 mb-1">Check-out</span>
                <span className="font-semibold text-white">{property.check_out_time}</span>
              </div>
            </div>
          </GlassCard>

          <BookingCalendar />

          <GlassCard className="h-48 flex items-center justify-center relative overflow-hidden group cursor-pointer">
            {/* Placeholder for Map */}
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
              <span className="flex items-center gap-2 text-white/60 group-hover:text-cyan-400 transition-colors">
                <MapPin size={24} /> Xem trên bản đồ
              </span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Content Tabs / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-cyan-400" /> Giới thiệu
            </h3>
            <GlassCard>
              <p className="text-white/70 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </GlassCard>
          </section>

          {/* Amenities */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4">Tiện nghi nổi bật</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((item, idx) => (
                <GlassCard key={idx} className="!p-3 flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Check size={14} />
                  </div>
                  <span className="text-white/80 text-sm">{item.name}</span>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Room Selection List */}
          <section id="rooms">
            <h3 className="text-xl font-bold text-white mb-4">Chọn phòng nghỉ</h3>
            <div className="space-y-4">
              {property.rooms.map((room) => (
                <GlassCard key={room.id} className="relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Room Image Placeholder */}
                    <div className="w-full md:w-48 h-40 bg-slate-800 rounded-lg flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=500&q=80" alt={room.name} className="w-full h-full object-cover rounded-lg" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{room.name}</h4>
                          {room.quantity <= 3 && (
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Chỉ còn {room.quantity} phòng</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                          <span className="flex items-center gap-1"><Users size={12} /> {room.capacity} Người lớn</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {room.size_sqm}m²</span>
                        </div>
                        <p className="text-white/60 text-sm line-clamp-2 mb-4">{room.description}</p>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-2xl font-bold text-cyan-300">{room.price.toLocaleString('vi-VN')}₫</span>
                          <span className="text-xs text-white/40 ml-1">/ đêm</span>
                        </div>

                        <div className="flex gap-2">
                          <GlassButton
                            variant="secondary"
                            className="!py-2 !px-3 !text-xs"
                            onClick={() => handleAddToCart(room)}
                          >
                            <ShoppingCart size={14} className="mr-1" /> Thêm vào giỏ
                          </GlassButton>
                          <GlassButton className="!py-2 !px-4 !text-xs bg-cyan-600 hover:bg-cyan-500 text-white border-none"
                            onClick={() => navigate('/booking', { state: { room, property } })}
                          >
                            Đặt ngay
                          </GlassButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar - Booking Summary / Total */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <GlassCard className="border-l-4 border-l-cyan-500">
              <h4 className="font-bold text-white mb-2">Đang có nhu cầu tốt!</h4>
              <p className="text-sm text-white/60">Đã có 12 người đặt phòng tại đây trong 24h qua.</p>
            </GlassCard>

            <GlassCard>
              <h4 className="font-bold text-white mb-4">Hỗ trợ đặt phòng</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Liên hệ Host</p>
                    <p className="text-xs text-white/50">Phản hồi trong 1 giờ</p>
                  </div>
                </div>
                <GlassButton
                  variant="outline"
                  className="w-full text-sm"
                  onClick={() => navigate('/chat', { state: { hostId: property.host_id, propertyName: property.title } })}
                >
                  Gửi tin nhắn
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

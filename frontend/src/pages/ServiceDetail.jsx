import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { MapPin, Star, Clock, CheckCircle, Share2, Heart, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ServiceDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Mock Data (In real app, fetch by id)
  const service = {
    id: parseInt(id) || 1,
    name: "Resort Ven Biển Cao Cấp",
    location: "Bãi biển Mỹ Khê, Đà Nẵng",
    rating: 4.8,
    reviews: 128,
    price: 120,
    description: "Trải nghiệm kỳ nghỉ dưỡng tuyệt vời tại resort 5 sao ven biển với hồ bơi vô cực, spa cao cấp và ẩm thực đa dạng. Phòng view biển panorama mang đến cảm giác thư giãn tuyệt đối.",
    features: ["Hồ bơi vô cực", "Wifi miễn phí", "Bữa sáng buffet", "Xe đưa đón", "Spa & Massage", "Gym"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  };

  const handleAddToCart = () => {
    addToCart({
      id: service.id,
      name: service.name,
      price: service.price,
      image: service.images[0] // Store the URL directly
    });
    // Optional: Show toast notification or navigate
    navigate('/cart');
  };

  return (
    <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-12">
      <Link to="/booking" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Quay lại
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <GlassCard className="!p-2">
            <div className="h-[400px] rounded-xl bg-opacity-70 w-full overflow-hidden">
              <img
                src={service.images[selectedImage]}
                alt={service.name}
                className="w-full h-full object-cover transition-all duration-500 ease-in-out hover:scale-105"
              />
            </div>
          </GlassCard>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {service.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-24 h-24 rounded-lg flex-shrink-0 border-2 transition-all p-0.5 overflow-hidden ${selectedImage === index ? 'border-cyan-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-md" />
              </button>
            ))}
          </div>

          <GlassCard>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-white">{service.name}</h1>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <Share2 size={20} />
                </button>
                <button className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white/70 mb-6">
              <span className="flex items-center gap-1"><MapPin size={18} /> {service.location}</span>
              <span className="flex items-center gap-1 text-yellow-400 font-bold"><Star size={18} fill="currentColor" /> {service.rating} ({service.reviews} đánh giá)</span>
              <span className="flex items-center gap-1"><Clock size={18} /> 2 Ngày 1 Đêm</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">Mô tả</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              {service.description}
            </p>

            <h3 className="text-xl font-bold text-white mb-3">Tiện ích</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-white/80">
                  <CheckCircle size={16} className="text-green-400" /> {feature}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right: Booking Actions */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-28">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white/60">Giá từ</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-cyan-300">${service.price}</span>
                <span className="text-sm text-white/50">/ đêm</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <label className="block text-xs text-white/50 mb-1">Check-in</label>
                <input type="date" className="w-full bg-transparent text-white outline-none" />
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <label className="block text-xs text-white/50 mb-1">Check-out</label>
                <input type="date" className="w-full bg-transparent text-white outline-none" />
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <label className="block text-xs text-white/50 mb-1">Khách</label>
                <select className="w-full bg-transparent text-white outline-none">
                  <option className="bg-slate-800">1 Người lớn</option>
                  <option className="bg-slate-800">2 Người lớn</option>
                  <option className="bg-slate-800">2 Người lớn, 1 Trẻ em</option>
                </select>
              </div>
            </div>

            <Link to="/payment">
              <GlassButton variant="primary" className="w-full mb-3">
                Đặt Ngay
              </GlassButton>
            </Link>
            <GlassButton
              variant="secondary"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} /> Thêm vào giỏ hàng
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

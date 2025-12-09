import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, MapPin, Image as ImageIcon, BedDouble } from 'lucide-react';
import Modal from '../../components/common/Modal';

const RoomManagerModal = ({ service, isOpen, onClose }) => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Deluxe Ocean View', type: 'Double', price: '1,500,000', status: 'Available' },
    { id: 2, name: 'Standard Garden', type: 'Single', price: '800,000', status: 'Maintenance' },
    { id: 3, name: 'Family Suite', type: 'Suite', price: '3,200,000', status: 'Booked' },
  ]);

  const [newRoom, setNewRoom] = useState({ name: '', type: 'Double', price: '', status: 'Available' });

  const handleAddRoom = (e) => {
    e.preventDefault();
    setRooms([...rooms, { id: Date.now(), ...newRoom }]);
    setNewRoom({ name: '', type: 'Double', price: '', status: 'Available' });
  };

  const toggleStatus = (id) => {
    setRooms(rooms.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === 'Available' ? 'Maintenance' : 'Available' };
      }
      return r;
    }));
  };

  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Quản lý phòng - ${service.name}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
            <span className="block text-xl font-bold text-green-600">{rooms.filter(r => r.status === 'Available').length}</span>
            <span className="text-xs text-green-700">Trống</span>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-center">
            <span className="block text-xl font-bold text-red-600">{rooms.filter(r => r.status === 'Booked').length}</span>
            <span className="text-xs text-red-700">Đã đặt</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <span className="block text-xl font-bold text-gray-600">{rooms.filter(r => r.status === 'Maintenance').length}</span>
            <span className="text-xs text-gray-700">Bảo trì</span>
          </div>
        </div>

        <form onSubmit={handleAddRoom} className="flex gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500">Tên phòng</label>
            <input required className="w-full text-sm border rounded p-1 text-gray-900" value={newRoom.name} onChange={e => setNewRoom({ ...newRoom, name: e.target.value })} placeholder="VD: P101" />
          </div>
          <div className="w-24">
            <label className="text-xs font-bold text-gray-500">Loại</label>
            <select className="w-full text-sm border rounded p-1 text-gray-900" value={newRoom.type} onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}>
              <option>Single</option><option>Double</option><option>Suite</option>
            </select>
          </div>
          <div className="w-28">
            <label className="text-xs font-bold text-gray-500">Giá</label>
            <input required className="w-full text-sm border rounded p-1 text-gray-900" value={newRoom.price} onChange={e => setNewRoom({ ...newRoom, price: e.target.value })} />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700"><Plus size={18} /></button>
        </form>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {rooms.map(room => (
            <div key={room.id} className="flex items-center justify-between p-3 border rounded-lg bg-white hover:shadow-sm transition-shadow">
              <div>
                <div className="font-bold text-gray-800 flex items-center gap-2">
                  {room.name}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${room.status === 'Available' ? 'bg-green-100 text-green-700' :
                    room.status === 'Booked' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {room.status === 'Booked' ? 'Đã có khách' : room.status === 'Available' ? 'Sẵn sàng' : 'Bảo trì'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{room.type} • {room.price}₫ / đêm</div>
              </div>

              <div className="flex items-center gap-2">
                {room.status !== 'Booked' && (
                  <button
                    onClick={() => toggleStatus(room.id)}
                    className={`text-sm px-3 py-1 rounded border transition-colors ${room.status === 'Available'
                      ? 'border-gray-300 text-gray-500 hover:bg-gray-50'
                      : 'border-green-300 text-green-600 hover:bg-green-50'
                      }`}
                  >
                    {room.status === 'Available' ? 'Khóa' : 'Mở'}
                  </button>
                )}
                <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

const Services = () => {
  // TODO: Backend Integration - Fetch services from API
  // useEffect(() => {
  //   fetchServices().then(data => setServices(data));
  // }, []);

  // Dummy Data
  const [services, setServices] = useState([
    { id: 101, name: 'Luxury King Room', category: 'Hotel', price: '2,500,000 ₫', location: 'Hanoi', rating: 4.8, status: 'Available' },
    { id: 102, name: 'Premium Spa Package', category: 'Spa', price: '800,000 ₫', location: 'Da Nang', rating: 4.5, status: 'Unavailable' },
    { id: 103, name: 'City Tour half-day', category: 'Tour', price: '500,000 ₫', location: 'HCMC', rating: 4.2, status: 'Available' },
    { id: 104, name: 'Standard Double Room', category: 'Hotel', price: '1,200,000 ₫', location: 'Nha Trang', rating: 4.0, status: 'Available' },
  ]);

  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [roomManagerService, setRoomManagerService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hotel',
    price: '',
    location: '',
    status: 'Available'
  });

  const resetForm = () => {
    setFormData({ name: '', category: 'Hotel', price: '', location: '', status: 'Available' });
    setEditingService(null);
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        category: service.category,
        price: service.price,
        location: service.location,
        status: service.status
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (editingService) {
      // TODO: Backend Integration - Update existing service
      // await updateServiceAPI(editingService.id, formData);
      // Update existing
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } : s));
    } else {
      // TODO: Backend Integration - Create new service
      // const createdService = await createServiceAPI(formData);
      // setServices([...services, createdService]);
      // Add new
      const newService = {
        id: services.length + 100, // simple id gen
        ...formData,
        rating: 0 // default for new
      };
      setServices([...services, newService]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      // TODO: Backend Integration - Delete service
      // await deleteServiceAPI(id);
      setServices(services.filter(s => s.id !== id));
    }
  };

  const filteredServices = services.filter(service => {
    const matchCategory = filterCategory === 'All' || service.category === filterCategory;
    const matchStatus = filterStatus === 'All' || service.status === filterStatus;
    const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ & Địa điểm</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-lg shadow-blue-500/30"
        >
          <Plus size={18} className="mr-2" />
          Thêm dịch vụ mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border-gray-200 rounded-lg text-sm p-2 bg-white border focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
          >
            <option value="All">Tất cả danh mục</option>
            <option value="Hotel">Hotel</option>
            <option value="Tour">Tour</option>
            <option value="Spa">Spa</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-gray-200 rounded-lg text-sm p-2 bg-white border focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white flex flex-col">
              <div className="h-40 bg-gray-200 relative">
                <img
                  src={`https://via.placeholder.com/400x200?text=${service.name}`}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                  {service.category}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{service.name}</h3>
                  {service.status === 'Available' ? (
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-2"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-2"></span>
                  )}
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin size={14} className="mr-1" />
                  {service.location}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-blue-600">{service.price}</span>
                  <div className="flex space-x-1 items-center">
                    {service.category === 'Hotel' && (
                      <button
                        onClick={() => setRoomManagerService(service)}
                        className="px-2 py-1.5 text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors flex items-center gap-1 mr-1"
                        title="Quản lý phòng"
                      >
                        <BedDouble size={14} /> <span className="text-xs font-semibold">Phòng</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenModal(service)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Manage Images">
                      <ImageIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
      >
        <form onSubmit={handleSaveService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên dịch vụ"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Hotel">Hotel</option>
                <option value="Tour">Tour</option>
                <option value="Spa">Spa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="VD: 500,000 ₫"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="VD: Hà Nội"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
            >
              {editingService ? 'Lưu thay đổi' : 'Thêm dịch vụ'}
            </button>
          </div>
        </form>
      </Modal>

      <RoomManagerModal
        service={roomManagerService}
        isOpen={!!roomManagerService}
        onClose={() => setRoomManagerService(null)}
      />
    </div>
  );
};

export default Services;

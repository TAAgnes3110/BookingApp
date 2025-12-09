import React, { useState } from 'react';
import { Search, Filter, Shield, AlertTriangle, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../../components/common/Modal';

const Users = () => {
  const [activeTab, setActiveTab] = useState('users'); // users or merchants
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Backend Integration - Fetch users from API
  // useEffect(() => {
  //   fetchUsers().then(data => setUsers(data));
  // }, []);

  // Dummy data
  const [users, setUsers] = useState([
    { id: 1, name: 'Nguyen Van A', email: 'anv@example.com', role: 'User', status: 'Active', joined: '2023-12-01' },
    { id: 2, name: 'Tran Thi B', email: 'btt@example.com', role: 'Merchant', status: 'Active', joined: '2023-11-15' },
    { id: 3, name: 'Le Van C', email: 'clv@example.com', role: 'User', status: 'Banned', joined: '2023-10-20' },
    { id: 4, name: 'Pham Van D', email: 'dpv@example.com', role: 'User', status: 'Warning', joined: '2023-09-05' },
    { id: 5, name: 'Hoang Thi E', email: 'eht@example.com', role: 'Merchant', status: 'Active', joined: '2023-12-05' },
  ]);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'Active'
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'User', status: 'Active' });
    setEditingUser(null);
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
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

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (editingUser) {
      // TODO: Backend Integration - Update existing user
      // await updateUserAPI(editingUser.id, formData);
      // Update existing user
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      // TODO: Backend Integration - Create new user
      // const createdUser = await createUserAPI(formData);
      // setUsers([...users, createdUser]);
      // Add new user
      const newUser = {
        id: users.length + 1,
        ...formData,
        joined: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      // TODO: Backend Integration - Delete user
      // await deleteUserAPI(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchTab = activeTab === 'all' || (activeTab === 'merchants' ? user.role === 'Merchant' : user.role === 'User');
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-lg shadow-blue-500/30"
        >
          <Plus size={18} className="mr-2" />
          Thêm người dùng
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Người dùng
            </button>
            <button
              onClick={() => setActiveTab('merchants')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'merchants' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Merchants
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Tên</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Ngày tham gia</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">#{user.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'Merchant' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      } `}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${user.status === 'Active' ? 'bg-green-100 text-green-700' :
                      user.status === 'Banned' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      } `}>
                      {user.status === 'Banned' && <Shield size={12} className="mr-1" />}
                      {user.status === 'Warning' && <AlertTriangle size={12} className="mr-1" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        title="Sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>Hiển thị {filteredUsers.length} kết quả</span>
          <div className="flex space-x-2">
            <button disabled className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Trước</button>
            <button disabled className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập họ tên đầy đủ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="User">User</option>
                <option value="Merchant">Merchant</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Warning">Warning</option>
                <option value="Banned">Banned</option>
              </select>
            </div>
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
              {editingUser ? 'Lưu thay đổi' : 'Thêm người dùng'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;

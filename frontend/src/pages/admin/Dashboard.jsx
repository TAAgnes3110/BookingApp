import React from 'react';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
        {trend > 0 ? '+' : ''}{trend}%
        <TrendingUp size={16} className="ml-1" />
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </motion.div>
);

const Dashboard = () => {
  // TODO: Backend Integration - Fetch dashboard stats from API
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     const [statsData, recentTxData, topServicesData] = await Promise.all([
  //       adminApi.getDashboardStats(),
  //       adminApi.getRecentTransactions(),
  //       adminApi.getTopServices()
  //     ]);
  //     setStats(statsData);
  //     setRecentTransactions(recentTxData);
  //     setTopServices(topServicesData);
  //   };
  //   fetchDashboardData();
  // }, []);

  const stats = [
    { title: 'Tổng người dùng', value: '1,234', icon: Users, color: 'bg-blue-500', trend: 12.5 },
    { title: 'Doanh thu tháng', value: '45,000,000 ₫', icon: DollarSign, color: 'bg-green-500', trend: 8.2 },
    { title: 'Booking mới', value: '856', icon: Calendar, color: 'bg-purple-500', trend: -2.4 },
    { title: 'Tỉ lệ hoàn thành', value: '94%', icon: TrendingUp, color: 'bg-orange-500', trend: 4.1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan</h2>
        <div className="flex space-x-2">
          <select className="border-gray-200 rounded-lg text-sm p-2 bg-white">
            <option>7 ngày qua</option>
            <option>Tháng này</option>
            <option>Năm nay</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Giao dịch gần đây</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    U{i}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">User {i}</p>
                    <p className="text-xs text-gray-500">Booking Hotel XYZ</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">500,000 ₫</p>
                  <p className="text-xs text-green-500">Thành công</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top dịch vụ</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                    <img src={`https://via.placeholder.com/150?text=S${i}`} alt="Service" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Luxury Hotel Room {i}</p>
                    <p className="text-xs text-gray-500">120 bookings</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Top {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

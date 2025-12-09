import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b sticky top-0 z-40 py-4 px-8 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Hệ thống quản trị</h2>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

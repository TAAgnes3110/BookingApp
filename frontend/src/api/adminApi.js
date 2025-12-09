import axiosClient from './axiosClient';

const adminApi = {
  getDashboardStats() {
    const url = '/admin/stats';
    return axiosClient.get(url);
  },

  getRecentTransactions() {
    const url = '/admin/recent-transactions';
    return axiosClient.get(url);
  },

  getTopServices() {
    const url = '/admin/top-services';
    return axiosClient.get(url);
  }
};

export default adminApi;

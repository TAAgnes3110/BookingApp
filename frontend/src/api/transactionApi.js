import axiosClient from './axiosClient';

const transactionApi = {
  getAll(params) {
    const url = '/transactions';
    return axiosClient.get(url, { params });
  },

  get(id) {
    const url = `/transactions/${id}`;
    return axiosClient.get(url);
  },

  // Usually transactions are created by system events, but maybe for manual entry or refund processing
  createRefund(id, data) {
      const url = `/transactions/${id}/refund`;
      return axiosClient.post(url, data);
  },

  exportReport(params) {
       const url = '/transactions/export';
       return axiosClient.get(url, { params, responseType: 'blob' });
  }
};

export default transactionApi;

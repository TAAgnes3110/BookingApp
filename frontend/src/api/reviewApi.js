import axiosClient from './axiosClient';

const reviewApi = {
  getAll(params) {
    const url = '/reviews';
    return axiosClient.get(url, { params });
  },

  get(id) {
    const url = `/reviews/${id}`;
    return axiosClient.get(url);
  },

  approve(id) {
    const url = `/reviews/${id}/approve`;
    return axiosClient.patch(url);
  },

  hide(id) {
    const url = `/reviews/${id}/hide`;
    return axiosClient.patch(url);
  },

  // If we delete completely
  remove(id) {
      const url = `/reviews/${id}`;
      return axiosClient.delete(url);
  }
};

export default reviewApi;

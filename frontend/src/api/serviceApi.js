import axiosClient from './axiosClient';

const serviceApi = {
  getAll(params) {
    const url = '/services';
    return axiosClient.get(url, { params });
  },

  get(id) {
    const url = `/services/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/services';
    return axiosClient.post(url, data);
  },

  update(id, data) {
    const url = `/services/${id}`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/services/${id}`;
    return axiosClient.delete(url);
  },
};

export default serviceApi;

import axiosClient from './axiosClient';

const authApi = {
  login(data) {
    const url = '/auth/login';
    return axiosClient.post(url, data);
  },

  register(data) {
    const url = '/auth/register';
    return axiosClient.post(url, data);
  },

  logout() {
      const url = '/auth/logout';
      return axiosClient.post(url);
  },

  getMe() {
      const url = '/auth/me';
      return axiosClient.get(url);
  }
};

export default authApi;

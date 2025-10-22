import api from './api';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
};

const authService = {
  register: async (userData) => {
    const res = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    if (res.data.token) localStorage.setItem('userToken', res.data.token);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    if (res.data.token) localStorage.setItem('userToken', res.data.token);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('userToken');
    // api.post(AUTH_ENDPOINTS.LOGOUT).catch(() => {});
  },

  isLoggedIn: () => !!localStorage.getItem('userToken'),
  getToken: () => localStorage.getItem('userToken'),
};

export default authService;

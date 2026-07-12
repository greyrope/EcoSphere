import axios from 'axios';

const tokenStorageKey = 'ecosphere_token';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStoredToken = () => localStorage.getItem(tokenStorageKey);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(tokenStorageKey, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  localStorage.removeItem(tokenStorageKey);
  delete api.defaults.headers.common.Authorization;
};

const storedToken = getStoredToken();
if (storedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
}

// Intercept responses to extract data directly and log errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('🚨 API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const esgService = {
  getHealth: () => api.get('/health'),
  signUp: (payload) => api.post('/auth/signup', payload),
  signIn: (payload) => api.post('/auth/signin', payload),
  getCurrentUser: () => api.get('/auth/me'),
  getProfile: (userId) => api.get('/profile', { params: { user_id: userId } }),
  getOrganization: (orgId) => api.get('/organizations', { params: { org_id: orgId } }),
  getEnvironmentalMetrics: (orgId, params = {}) =>
    api.get('/metrics/environmental', { params: { org_id: orgId, ...params } }),
  getSocialMetrics: (orgId, params = {}) =>
    api.get('/metrics/social', { params: { org_id: orgId, ...params } }),
  getGovernanceMetrics: (orgId, params = {}) =>
    api.get('/metrics/governance', { params: { org_id: orgId, ...params } }),
  getPolicies: (orgId, category = '') =>
    api.get('/policies', { params: { org_id: orgId, category } }),
  createPolicy: (policy) => api.post('/policies', policy),
  getBadges: () => api.get('/badges'),
  getUserBadges: (userId) => api.get('/badges/user', { params: { user_id: userId } }),
  getRewards: () => api.get('/rewards'),
  redeemReward: (rewardId) => api.post('/rewards/redeem', { reward_id: rewardId }),
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (notificationId) =>
    api.post('/notifications/read', { notification_id: notificationId }),
  submitCSR: (payload) => api.post('/csr', payload),
};

export default api;

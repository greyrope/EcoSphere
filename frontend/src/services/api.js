import axios from 'axios';

// Create an Axios instance
// Note: Tell your backend partner to let you know what port they are running on (e.g., 5000 or 8080)
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept responses to extract data directly and log errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('🚨 API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Define your endpoint functions here based on the blueprint we made earlier
export const esgService = {
  // Dashboard Endpoints
  getDashboardSummary: () => api.get('/dashboard/summary'),

  // Gamification Endpoints
  getActiveChallenges: () => api.get('/gamification/active'),
  joinChallenge: (challengeId) =>
    api.post(`/gamification/join`, { challengeId }),
  redeemReward: (rewardId) => api.post(`/gamification/redeem`, { rewardId }),

  // Settings Endpoints
  updateBusinessRule: (ruleId, enabled) =>
    api.patch(`/settings/rules/${ruleId}`, { enabled }),

  // Reports
  generateReport: (filters) => api.post('/reports/generate', filters),
};

export default api;

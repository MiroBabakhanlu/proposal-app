import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Track if we're refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// req interceptor so we can send the token with  every req automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// res interceptor - handle 401 and refresh I aimed to create  smooth experince for user when accesstoken is expired so it automatically gets a new one
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If not 401 or already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If refreshing queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      // refresh endpoint
      const { data } = await axios.post(
        `${API.defaults.baseURL}/users/refresh-token`,
        { refreshToken }
      );

      // new access token
      localStorage.setItem('token', data.accessToken);

      // updatee default header
      API.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

      processQueue(null, data.accessToken);
      return API(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Auth endpoints
export const register = (userData) => API.post('/users/register', userData);
export const login = (credentials) => API.post('/users/login', credentials);
export const getMe = () => API.get('/users/me');
export const logout = (refreshToken) => API.post('/users/logout', { refreshToken });
///////////////////////

//proposals endpoints
export const getMyProposals = (params) => API.get('/proposals/my', { params });
export const getAllProposals = (params) => API.get('/proposals', { params });
export const getProposalById = (id) => API.get(`/proposals/${id}`);
export const createProposal = (formData) => API.post('/proposals', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateProposalStatus = (id, status) => API.patch(`/proposals/${id}/status`, { status });

// Tag endpoints
export const getTags = () => API.get('/tags');
export const createTag = (name) => API.post('/tags', { name });

// review endpoints
export const getProposalReviews = (proposalId) => API.get(`/proposals/${proposalId}/reviews`);
export const getMyReviews = () => API.get('/reviews/my-reviews');
export const submitReview = (proposalId, reviewData) =>
  API.post(`/reviews/${proposalId}`, reviewData);
export const deleteReview = (reviewId) => API.delete(`/reviews/${reviewId}`);
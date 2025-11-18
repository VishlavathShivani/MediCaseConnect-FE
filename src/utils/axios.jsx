import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});

let getTokenFunction = null;

export const setTokenGetter = (getTokenFn) => {
  getTokenFunction = getTokenFn;
};

// Add token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    
    if (getTokenFunction) {
      try {
        const token = await getTokenFunction();
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('❌ Error getting token:', error);
      }
    } else {
      console.warn('⚠️ No token getter function set');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response || error);
    
    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized - redirecting to login');
      // Optional: redirect to login
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
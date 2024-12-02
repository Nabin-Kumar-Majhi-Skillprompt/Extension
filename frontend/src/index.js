import axios from 'axios';

// Base configuration for axios
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL || process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request interceptor for adding auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Global error handling
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
            break;
          case 403:
            console.error('Forbidden: You do not have permission');
            break;
          case 500:
            console.error('Server Error: Please try again later');
            break;
          default:
            console.error('An error occurred');
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Core services
class CoreService {
  constructor(baseURL) {
    this.api = createAxiosInstance(baseURL);
  }

  // Generic CRUD operations
  async get(endpoint, config = {}) {
    try {
      const response = await this.api.get(endpoint, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(endpoint, data, config = {}) {
    try {
      const response = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(endpoint, data, config = {}) {
    try {
      const response = await this.api.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(endpoint, config = {}) {
    try {
      const response = await this.api.delete(endpoint, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Error handling method
  handleError(error) {
    console.error('Service Error:', error);
    throw error;
  }

  // Authentication helpers
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

// Specific service instances
const AuthService = {
  login: async (email, password) => {
    const service = new CoreService();
    try {
      const response = await service.post('/auth/login', { email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (username, email, password) => {
    const service = new CoreService();
    try {
      const response = await service.post('/auth/register', { 
        username, 
        email, 
        password 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

const UserService = {
  getProfile: async () => {
    const service = new CoreService();
    return service.get('/user/profile');
  },

  updateProfile: async (userData) => {
    const service = new CoreService();
    return service.put('/user/profile', userData);
  }
};

// Export services
export {
  CoreService,
  AuthService,
  UserService,
  createAxiosInstance
};
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AppService {
  // Generic error handler
  static handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Server Error:', error.response.data);
      return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      return { message: 'Network error. Please check your connection.' };
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
      return { message: 'An unexpected error occurred.' };
    }
  }

  // Get authenticated user's profile
  static async getUserProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/profile`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Update user profile
  static async updateProfile(userData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/user/update`, userData, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic GET request
  static async get(endpoint) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic POST request
  static async post(endpoint, data) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic PUT request
  static async put(endpoint, data) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic DELETE request
  static async delete(endpoint) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}${endpoint}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists
  }

  // Get current user from local storage
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default AppService;
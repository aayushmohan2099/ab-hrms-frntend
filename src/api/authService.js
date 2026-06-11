import api from './axios';

export const authService = {
  /**
   * Fetch the captcha image (base64 string)
   * @returns {Promise<{image: string}>}
   */
  getCaptcha: async () => {
    const response = await api.get('/auth/captcha/');
    return response.data;
  },

  /**
   * Log the user in with credentials and captcha
   * @param {Object} credentials - { username, password, captcha }
   * @returns {Promise<{message: string, access: string, refresh: string, user: Object}>}
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    
    // Store the access token and safe user data upon successful login
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Manually refresh the access token
   * Note: You rarely need to call this manually, as the axios interceptor handles it.
   */
  refreshToken: async () => {
    const response = await api.post('/auth/refresh/');
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }
    return response.data;
  },

  /**
   * Log the user out and blacklist the refresh token
   */
  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout API failed, cleaning up local state anyway.', error);
    } finally {
      // Always clear local state, even if the backend request fails (e.g., network error)
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }
};
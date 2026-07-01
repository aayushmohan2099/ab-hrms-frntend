// src/api/userMgmnt.js
import api from "./axios";

export const userManagementService = {
  /**
   * 1) List users (Paginated, Role-based)
   * @param {number} page - The page number to fetch.
   * @param {number} pageSize - The number of records per page (default 20).
   * @param {Object} extraParams - Additional query parameters (e.g., search, filters).
   * @returns {Promise<Object>} The paginated response data { count, next, previous, results }.
   */
  getUsers: async (page = 1, pageSize = 20, extraParams = {}) => {
    const response = await api.get("/users/list/", {
      params: {
        page: page,
        page_size: pageSize,
        ...extraParams,
      },
    });
    return response.data;
  },

  /**
   * 2) Retrieve complete details of a specific user.
   * @param {number|string} id - The ID of the user.
   * @returns {Promise<Object>} The user detail data.
   */
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  /**
   * 3) Create a new user (Multipart Form Data).
   * @param {FormData} formData - The user data wrapped in a FormData object (required for image uploads).
   * @returns {Promise<Object>} The created user data (including auto-generated password).
   */
  createUser: async (formData) => {
    const response = await api.post("/users/create/", formData, {
      headers: {
        // Axios automatically sets the boundary for multipart/form-data when passing a FormData object,
        // but it's good practice to explicitly state our intent here.
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * 6) Update a user (PATCH mapping for partial updates).
   * @param {number|string} id - The ID of the user to update.
   * @param {FormData} formData - The partial user data to update, wrapped in FormData.
   * @returns {Promise<Object>} The updated user data.
   */
  updateUser: async (id, formData) => {
    const response = await api.patch(`/users/${id}/update/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * 5) Delete user (Soft Delete).
   * @param {number|string} id - The ID of the user to delete.
   * @returns {Promise<Object>} Empty response on successful deletion (usually 204 No Content).
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}/delete/`);
    return response.data;
  },

  /**
   * 4) Reset a user's password to an auto-generated format.
   * @param {number|string} id - The ID of the user.
   * @returns {Promise<Object>} Success message along with the newly generated password.
   */
  resetPassword: async (id) => {
    const response = await api.post(`/users/${id}/reset-password/`);
    return response.data;
  },

  /**
   * 7) Change User Password (With validation of current password).
   * @param {number|string} id - The ID of the user.
   * @param {Object} data - Contains { old_password, new_password }.
   * @returns {Promise<Object>} Success message.
   */
  changePassword: async (id, data) => {
    const response = await api.post(`/users/${id}/change-password/`, data);
    return response.data;
  },
};

// src/api/deptService.js
import api from "./axios";

export const departmentService = {
  /**
   * 1) List departments (Paginated)
   * @param {number} page - The page number to fetch.
   * @param {number} pageSize - The number of records per page (default 20).
   * @param {Object} extraParams - Additional query parameters (e.g., search, filters).
   * @returns {Promise<Object>} The paginated response data { count, next, previous, results }.
   */
  getDepartments: async (page = 1, pageSize = 20, extraParams = {}) => {
    const response = await api.get("/departments/list/", {
      params: {
        page: page,
        page_size: pageSize,
        ...extraParams,
      },
    });
    return response.data;
  },

  /**
   * 2) Retrieve complete details of a specific department.
   * @param {number|string} id - The ID of the department.
   * @returns {Promise<Object>} The department detail data.
   */
  getDepartmentById: async (id) => {
    const response = await api.get(`/departments/${id}/`);
    return response.data;
  },

  /**
   * 3) Create a new department.
   * @param {Object} data - The department data { name, code, description, head }.
   * @returns {Promise<Object>} The created department data.
   */
  createDepartment: async (data) => {
    const response = await api.post("/departments/create/", data);
    return response.data;
  },

  /**
   * 6) Update a department (PATCH mapping for partial updates).
   * @param {number|string} id - The ID of the department to update.
   * @param {Object} data - The partial department data to update.
   * @returns {Promise<Object>} The updated department data.
   */
  updateDepartment: async (id, data) => {
    const response = await api.patch(`/departments/${id}/update/`, data);
    return response.data;
  },

  /**
   * 5) Delete department (Soft Delete).
   * @param {number|string} id - The ID of the department to delete.
   * @returns {Promise<Object>} Empty response on successful deletion (usually 204 No Content).
   */
  deleteDepartment: async (id) => {
    const response = await api.delete(`/departments/${id}/delete/`);
    return response.data;
  },
};

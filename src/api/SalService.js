// src/api/SalService.js

import api from "./axios";

export const salService = {
  // ============================================================
  // SALARY STRUCTURES (Department Level)
  // ============================================================

  /**
   * 1) List Salary Structures for a Department (Paginated)
   * @param {number|string} deptId - Department ID.
   * @param {number} page - Page number.
   * @param {number} pageSize - Records per page.
   * @param {Object} extraParams - Additional query params.
   * @returns {Promise<Object>}
   */
  getSalaryStructures: async (
    deptId,
    page = 1,
    pageSize = 20,
    extraParams = {},
  ) => {
    const response = await api.get(
      `/dept/design/${deptId}/salary-structures/list/`,
      {
        params: {
          page,
          page_size: pageSize,
          ...extraParams,
        },
      },
    );

    return response.data;
  },

  /**
   * 2) Create Salary Structure
   * @param {number|string} deptId - Department ID.
   * @param {Object} data - Salary Structure payload.
   * @returns {Promise<Object>}
   */
  createSalaryStructure: async (deptId, data) => {
    const response = await api.post(
      `/dept/design/${deptId}/salary-structures/create/`,
      data,
    );

    return response.data;
  },

  /**
   * 3) Update Salary Structure
   * @param {number|string} deptId - Department ID.
   * @param {number|string} id - Salary Structure ID.
   * @param {Object} data - Updated payload.
   * @returns {Promise<Object>}
   */
  updateSalaryStructure: async (deptId, id, data) => {
    const response = await api.patch(
      `/dept/design/${deptId}/salary-structures/${id}/update/`,
      data,
    );

    return response.data;
  },

  /**
   * 4) Delete Salary Structure
   * @param {number|string} deptId - Department ID.
   * @param {number|string} id - Salary Structure ID.
   * @returns {Promise<Object>}
   */
  deleteSalaryStructure: async (deptId, id) => {
    const response = await api.delete(
      `/dept/design/${deptId}/salary-structures/${id}/delete/`,
    );

    return response.data;
  },

  // ============================================================
  // CUSTOM SALARY STRUCTURES (Employee Level)
  // ============================================================

  /**
   * 5) List Custom Salary Structures for an Employee (Paginated)
   * @param {number|string} empId - Employee ID.
   * @param {number} page - Page number.
   * @param {number} pageSize - Records per page.
   * @param {Object} extraParams - Additional query params.
   * @returns {Promise<Object>}
   */
  getCustomSalaryStructures: async (
    empId,
    page = 1,
    pageSize = 20,
    extraParams = {},
  ) => {
    const response = await api.get(
      `/dept/design/${empId}/custom-salary-structures/list/`,
      {
        params: {
          page,
          page_size: pageSize,
          ...extraParams,
        },
      },
    );

    return response.data;
  },

  /**
   * 6) Create Custom Salary Structure
   * @param {number|string} empId - Employee ID.
   * @param {Object} data - Custom Salary Structure payload.
   * @returns {Promise<Object>}
   */
  createCustomSalaryStructure: async (empId, data) => {
    const response = await api.post(
      `/dept/design/${empId}/custom-salary-structures/create/`,
      data,
    );

    return response.data;
  },

  /**
   * 7) Update Custom Salary Structure
   * @param {number|string} empId - Employee ID.
   * @param {number|string} id - Custom Salary Structure ID.
   * @param {Object} data - Updated payload.
   * @returns {Promise<Object>}
   */
  updateCustomSalaryStructure: async (empId, id, data) => {
    const response = await api.patch(
      `/dept/design/${empId}/custom-salary-structures/${id}/update/`,
      data,
    );

    return response.data;
  },

  /**
   * 8) Delete Custom Salary Structure
   * @param {number|string} empId - Employee ID.
   * @param {number|string} id - Custom Salary Structure ID.
   * @returns {Promise<Object>}
   */
  deleteCustomSalaryStructure: async (empId, id) => {
    const response = await api.delete(
      `/dept/design/${empId}/custom-salary-structures/${id}/delete/`,
    );

    return response.data;
  },

  /**
   * 9) Bulk Create Custom Salary Structures for Multiple Employees
   * @param {Object} data - Payload containing { employee_codes: ["CODE1", "CODE2"], tds_amount, epf_amount, esic_amount, effective_from, effective_to, remarks }
   * @returns {Promise<Object>}
   */
  bulkCreateCustomSalaryStructure: async (data) => {
    const response = await api.post(
      `/dept/design/custom-salary-structures/bulk-create/`,
      data,
    );

    return response.data;
  },

  /**
   * 10) List ALL Custom Salary Structures for an entire Department
   * @param {number|string} deptId - Department ID.
   * @param {number} page - Page number.
   * @param {number} pageSize - Records per page.
   * @param {Object} extraParams - Additional query params.
   * @returns {Promise<Object>}
   */
  getDepartmentCustomSalaryStructures: async (
    deptId,
    page = 1,
    pageSize = 50,
    extraParams = {},
  ) => {
    const response = await api.get(
      `/dept/design/${deptId}/custom-salary-structures/all/`,
      {
        params: {
          page,
          page_size: pageSize,
          ...extraParams,
        },
      },
    );

    return response.data;
  },

  /**
   * 11) Bulk Delete Custom Salary Structures for Multiple Employees
   * @param {Object} data - Payload containing { employee_codes: ["CODE1", "CODE2"] }
   * @returns {Promise<Object>}
   */
  bulkDeleteCustomSalaryStructure: async (data) => {
    const response = await api.post(
      `/dept/design/custom-salary-structures/bulk-delete/`,
      data,
    );

    return response.data;
  },
};

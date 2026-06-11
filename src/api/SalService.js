// src/api/SalService.js

import api from "./axios";

export const salService = {
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
};

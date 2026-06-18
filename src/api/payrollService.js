// src/api/payrollService.js

import api from "./axios";

export const payrollService = {
  // ============================================================
  // DESIGNATION RULES
  // ============================================================

  /**
   * List Designation Rules
   */
  getDesignationRules: async (
    deptId,
    page = 1,
    pageSize = 20,
    extraParams = {},
  ) => {
    const response = await api.get(`/dept/design/${deptId}/rules/list/`, {
      params: {
        page,
        page_size: pageSize,
        ...extraParams,
      },
    });

    return response.data;
  },

  /**
   * Create Designation Rule
   */
  createDesignationRule: async (deptId, data) => {
    const response = await api.post(
      `/dept/design/${deptId}/rules/create/`,
      data,
    );

    return response.data;
  },

  /**
   * Update Designation Rule
   */
  updateDesignationRule: async (deptId, id, data) => {
    const response = await api.patch(
      `/dept/design/${deptId}/rules/${id}/update/`,
      data,
    );

    return response.data;
  },

  /**
   * Delete Designation Rule
   */
  deleteDesignationRule: async (deptId, id) => {
    const response = await api.delete(
      `/dept/design/${deptId}/rules/${id}/delete/`,
    );

    return response.data;
  },

  // ============================================================
  // PAYROLL RUNS
  // ============================================================

  /**
   * List Payroll Runs
   */
  getPayrollRuns: async (deptId, page = 1, pageSize = 20, extraParams = {}) => {
    const response = await api.get(`/dept/design/${deptId}/runs/list/`, {
      params: {
        page,
        page_size: pageSize,
        ...extraParams,
      },
    });

    return response.data;
  },

  /**
   * Create Payroll Run
   */
  createPayrollRun: async (deptId, data) => {
    const response = await api.post(
      `/dept/design/${deptId}/runs/create/`,
      data,
    );

    return response.data;
  },

  /**
   * Update Payroll Run
   */
  updatePayrollRun: async (deptId, id, data) => {
    const response = await api.patch(
      `/dept/design/${deptId}/runs/${id}/update/`,
      data,
    );

    return response.data;
  },

  /**
   * Delete Payroll Run
   */
  deletePayrollRun: async (deptId, id) => {
    const response = await api.delete(
      `/dept/design/${deptId}/runs/${id}/delete/`,
    );

    return response.data;
  },

  // ============================================================
  // PAYROLL RECORDS
  // ============================================================

  /**
   * List Payroll Records for a Run
   */
  getPayrollRecords: async (
    deptId,
    runId,
    page = 1,
    pageSize = 20,
    extraParams = {},
  ) => {
    const response = await api.get(
      `/dept/design/${deptId}/runs/${runId}/records/list/`,
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
   * Create Payroll Record
   */
  createPayrollRecord: async (deptId, runId, data) => {
    const response = await api.post(
      `/dept/design/${deptId}/runs/${runId}/records/create/`,
      data,
    );

    return response.data;
  },

  /**
   * Update Payroll Record
   */
  updatePayrollRecord: async (deptId, runId, id, data) => {
    const response = await api.patch(
      `/dept/design/${deptId}/runs/${runId}/records/${id}/update/`,
      data,
    );

    return response.data;
  },

  /**
   * Delete Payroll Record
   */
  deletePayrollRecord: async (deptId, runId, id) => {
    const response = await api.delete(
      `/dept/design/${deptId}/runs/${runId}/records/${id}/delete/`,
    );

    return response.data;
  },

  /**
   * Trigger the backend computation engine to generate records for a run
   */
  generatePayrollRecords: async (deptId, runId) => {
    const response = await api.post(
      `/dept/design/${deptId}/runs/${runId}/generate/`,
    );
    return response.data;
  },
};

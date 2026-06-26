// src/api/empService.js

import api from "./axios";

export const empService = {
  // ============================================================
  // SINGLE EMPLOYEE OPERATIONS
  // ============================================================

  /**
   * 1) List Employees (Paginated with Filters & Search)
   * @param {number} page - Page number.
   * @param {number} pageSize - Records per page.
   * @param {Object} filters - Search and filter parameters (e.g., search, department, gender, doj_after).
   */
  getEmployees: async (page = 1, pageSize = 15, filters = {}) => {
    const response = await api.get("/employees/list/", {
      params: {
        page,
        page_size: pageSize,
        ...filters,
      },
    });
    return response.data;
  },

  /**
   * 1.1) Get specific Employee Detail by Employee Code
   * @param {string} empCode - The unique employee code (e.g., "AB-IT-001").
   */
  getEmployeeByCode: async (empCode) => {
    const response = await api.get(`/employees/${empCode}/`);
    return response.data;
  },

  /**
   * 2) One-Shot Create Employee (User & Profile simultaneously)
   * @param {FormData} formData - Data including the optional profile picture.
   */
  createEmployee: async (formData) => {
    const response = await api.post("/employees/create/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * 3) One-Shot Update Employee
   * @param {string} empCode - The unique employee code.
   * @param {FormData} formData - Partial update data including optional profile picture.
   */
  updateEmployee: async (empCode, formData) => {
    const response = await api.patch(
      `/employees/${empCode}/update/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * 4) One-Shot Delete Employee (Soft Deletes User & Profile)
   * @param {string} empCode - The unique employee code.
   */
  deleteEmployee: async (empCode) => {
    const response = await api.delete(`/employees/${empCode}/delete/`);
    return response.data;
  },

  // ============================================================
  // BULK OPERATIONS
  // ============================================================

  /**
   * Bulk Create Employees
   * Accepts CSV/XLSX upload
   */
  bulkCreateEmployees: async (formData, onUploadProgress = null) => {
    const response = await api.post("/employees/bulk-create/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

    return response.data;
  },

  /**
   * 3.1) Bulk Update Employees
   * @param {Array<Object>} updates - Array of update objects.
   * Each object MUST contain an 'employee_code'.
   * Example: [{ employee_code: "AB-IT-001", first_name: "John" }]
   */
  bulkUpdateEmployees: async (updates) => {
    const response = await api.patch("/employees/bulk-update/", { updates });
    return response.data;
  },

  /**
   * 4.1) Bulk Delete Employees
   * @param {Array<string>} empCodes - Array of employee codes to delete.
   * Example: ["AB-IT-001", "AB-HR-002"]
   */
  bulkDeleteEmployees: async (empCodes) => {
    // Axios uses 'data' property for body payloads in DELETE requests
    const response = await api.delete("/employees/bulk-delete/", {
      data: { employee_codes: empCodes },
    });
    return response.data;
  },

  // ============================================================
  // TDS FORMS (FORM 16) OPERATIONS
  // ============================================================

  /**
   * List TDS Forms (Paginated)
   * Admins see all, Employees see their own.
   * @param {number} page
   * @param {number} pageSize
   * @param {Object} filters - e.g., { financial_year: '2025-2026', quarter: 'Q1' }
   */
  getTDSForms: async (page = 1, pageSize = 20, filters = {}) => {
    const response = await api.get("/form-16/tds-forms/", {
      params: {
        page,
        page_size: pageSize,
        ...filters,
      },
    });
    return response.data;
  },

  /**
   * Delete a TDS Form
   * @param {string} thUrid - The TH URID of the TDS Form
   */
  deleteTDSForm: async (thUrid) => {
    const response = await api.delete(`/form-16/tds-forms/${thUrid}/`);
    return response.data;
  },

  /**
   * Bulk Upload TDS Forms via ZIP file
   * @param {FormData} formData - Contains zip_file, financial_year, quarter
   */
  bulkUploadTDSZIP: async (formData) => {
    const response = await api.post(
      "/form-16/tds-forms/bulk-upload-zip/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};

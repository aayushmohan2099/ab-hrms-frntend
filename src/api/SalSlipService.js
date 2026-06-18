// src/api/SalSlipService.js

import api from "./axios";

export const SalSlipService = {
  // ============================================================
  // SALARY SLIPS
  // ============================================================

  /**
   * 1) Generate or fetch a salary slip record for a specific employee.
   * If the slip doesn't exist for the given month/year but the payroll record does,
   * it creates a snapshot in the database.
   * * @param {string} employeeCode - Employee's unique code (e.g., "AB-IT-001").
   * @param {number|string} year - 4-digit year (e.g., 2026).
   * @param {number|string} month - Month number (1-12).
   * @returns {Promise<Object>} JSON response containing {"detail": "...", "slip_number": "..."}
   */
  generateSalarySlip: async (employeeCode, year, month) => {
    const response = await api.get(
      `/salary-slips/generate/${employeeCode}/${year}/${month}/`,
    );
    return response.data;
  },

  /**
   * 2) Download the PDF version of the generated Salary Slip.
   * Calls the same generation endpoint with '?download=true' and handles the
   * incoming binary PDF data by triggering a browser file download.
   * * @param {string} employeeCode - Employee's unique code.
   * @param {number|string} year - 4-digit year.
   * @param {number|string} month - Month number (1-12).
   */
  downloadSalarySlip: async (employeeCode, year, month) => {
    const response = await api.get(
      `/salary-slips/generate/${employeeCode}/${year}/${month}/`,
      {
        params: { download: "true" },
        responseType: "blob", // CRITICAL: Required to handle binary PDF data correctly
      },
    );

    // Create a Blob from the PDF stream
    const blobUrl = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    // Create a temporary anchor element to trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;

    // Format the filename elegantly
    const paddedMonth = String(month).padStart(2, "0");
    downloadLink.setAttribute(
      "download",
      `Salary_Slip_${employeeCode}_${year}_${paddedMonth}.pdf`,
    );

    // Append to body, click, and clean up
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Free up memory
    window.URL.revokeObjectURL(blobUrl);
  },

  // ============================================================
  // SALARY SLIP LISTING
  // ============================================================

  /**
   * 3) Get Salary Slip List
   *
   * Supports pagination and optional filtering.
   *
   * @param {number} page
   * @param {number} pageSize
   * @param {Object} filters
   *
   * Example:
   * {
   *   employee_code: "EMP001",
   *   year: 2026,
   *   month: 6
   * }
   */
  getSalarySlipList: async (page = 1, pageSize = 20, filters = {}) => {
    const response = await api.get("/salary-slips/list/", {
      params: {
        page,
        page_size: pageSize,
        ...filters,
      },
    });

    return response.data;
  },
};

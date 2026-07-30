// src/api/attendanceService.js

import api from "./axios";

export const attendanceService = {
  // ============================================================
  // CALENDAR & MONTHLY LISTING
  // ============================================================

  /**
   * 1) Get Monthly Attendance for all employees in a specific department.
   * @param {number|string} deptId - Department ID.
   * @param {number} month - Month number (1-12).
   * @param {number} year - 4-digit year (e.g., 2026).
   * @returns {Promise<Array>} Array of Employee objects with their daily_records and present_summary.
   */
  getDepartmentMonthlyAttendance: async (deptId, month, year) => {
    const response = await api.get(
      `/attendance/department/${deptId}/monthly/`,
      {
        params: {
          month,
          year,
        },
      },
    );
    return response.data;
  },

  /**
   * 1.1) Get Monthly Attendance for a specific employee (Calendar View).
   * @param {string} empCode - Employee Code.
   * @param {number} year - 4-digit year.
   * @param {number} month - Month number (1-12).
   * @returns {Promise<Object>} Object containing daily_records and current_month_records (leaves).
   */
  getEmployeeAttendance: async (empCode, year, month) => {
    const response = await api.get(
      `/attendance/emp/monthly-attendance/${empCode}/${year}/${month}/`,
    );
    return response.data;
  },

  // ============================================================
  // LEAVE APPLICATIONS
  // ============================================================

  /**
   * 2) Apply for Leave (Employee Self-Service)
   * @param {Object} data - Leave application payload.
   * Expected: { leave_type: "MATERNITY"|"CASUAL"|"SICK", start_date: "YYYY-MM-DD", end_date: "YYYY-MM-DD", reason: "..." }
   */
  applyForLeave: async (data) => {
    const response = await api.post("/attendance/leaves/apply/", data);
    return response.data;
  },

  /**
   * 2.1) Get Manager/Admin pending leave list
   * @param {number} page - Page number.
   * @param {number} pageSize - Page size.
   */
  getManagerLeaveList: async (page = 1, pageSize = 20) => {
    const response = await api.get("/attendance/leaves/manager/list/", {
      params: {
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  /**
   * 2.2) Get deep details of a specific leave application
   * @param {number|string} leaveId - ID of the leave application.
   */
  getLeaveDetail: async (leaveId) => {
    const response = await api.get(
      `/attendance/leaves/manager/${leaveId}/detail/`,
    );
    return response.data;
  },

  /**
   * 2.3) Manager Action: Approve or Reject a Leave Application
   * @param {number|string} leaveId - ID of the leave application.
   * @param {string} action - Action to take ("approve" or "reject").
   */
  actionLeaveApplication: async (leaveId, action) => {
    const response = await api.post(`/attendance/leaves/${leaveId}/${action}/`);
    return response.data;
  },

  /**
   * 2.4) Get My Leave History (Employee Self-Service)
   * Fetches the logged-in employee's own leave applications.
   * @param {number} page - Page number.
   * @param {number} pageSize - Page size.
   */
  getMyLeaveHistory: async (page = 1, pageSize = 20) => {
    const response = await api.get("/attendance/leaves/my-history/", {
      params: {
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  // ============================================================
  // MANUAL OVERRIDES & BULK OPERATIONS
  // ============================================================

  /**
   * 3) Mark an employee absent on a specific date.
   * @param {string} employeeCode - Employee's unique code (e.g., "AB-IT-001").
   * @param {string} date - Date in YYYY-MM-DD format.
   */
  markAbsent: async (employeeCode, date) => {
    const response = await api.post("/attendance/mark-absent/", {
      employee_code: employeeCode,
      date: date,
    });
    return response.data;
  },

  /**
   * 4) Bulk Upload Attendance via CSV
   * @param {File} file - The CSV file containing bulk attendance data.
   */
  bulkUploadAttendance: async (file, month, year) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", month);
    formData.append("year", year);

    const response = await api.post("/attendance/bulk-upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * 4.1) Download Bulk Upload CSV Format Template
   * Triggers a browser download of the expected CSV template.
   */
  downloadBulkUploadTemplate: (month, year) => {
    const url = `${api.defaults.baseURL}/attendance/bulk-upload/?download_format=true&month=${month}&year=${year}`;
    const link = document.createElement("a");
    link.href = url;

    const token = localStorage.getItem("access_token");
    if (token) {
      return api
        .get("/attendance/bulk-upload/", {
          params: { download_format: "true", month, year },
          responseType: "blob",
        })
        .then((response) => {
          const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
          const downloadLink = document.createElement("a");
          downloadLink.href = blobUrl;
          downloadLink.setAttribute(
            "download",
            `attendance_template_${year}_${String(month).padStart(2, "0")}.csv`,
          );
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        });
    } else {
      link.click();
    }
  },

  // ============================================================
  // HOLIDAY PATTERN
  // ============================================================

  /**
   * 5) Bulk Mark Holidays / Holiday Pattern
   * @param {Object} data
   * Example:
   * {
   *   year: 2026,
   *   month: 6,
   *   holidays: ["2026-06-07", "2026-06-14", "2026-06-21", "2026-06-28"]
   * }
   */
  bulkMarkHolidays: async (data) => {
    const response = await api.post("/attendance/holiday-pattern/", data);
    return response.data;
  },

  // ============================================================
  // MANAGER DASHBOARD
  // ============================================================

  /**
   * 6) Department Manager Dashboard Statistics
   *
   * Returns dashboard KPIs and attendance/leave summary
   * for the logged-in department manager.
   */
  getManagerDashboardStats: async () => {
    const response = await api.get("/attendance/manager/dashboard-stats/");
    return response.data;
  },

  // ============================================================
  // EMPLOYEE LEAVE BALANCE
  // ============================================================

  /**
   * 7) Get Leave Balance of an Employee
   *
   * @param {string} employeeCode - Employee Code (e.g. EMP001)
   * @returns {Promise<Object>}
   */
  getEmployeeLeaveBalance: async (employeeCode) => {
    const response = await api.get(
      `/attendance/leave-balance/${employeeCode}/`,
    );
    return response.data;
  },
};

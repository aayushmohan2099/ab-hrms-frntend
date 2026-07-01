// src/pages/admin/EmpList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { empService } from "../../api/empService";
import { departmentService } from "../../api/deptService";
import { designationService } from "../../api/desigService";
import { GovCard } from "../../components/ui/GovCard";
import { GovSelect } from "../../components/ui/GovSelect";
import { GovButton } from "../../components/ui/GovButton";
import { GovBadge } from "../../components/ui/GovBadge";
import { GovModal } from "../../components/ui/GovModal";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import {
  Edit,
  Plus,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Download,
} from "lucide-react";
import { EmpDetail } from "./EmpComps/EmpDetail";
import * as XLSX from "xlsx";

export function EmpList() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  const [designations, setDesignations] = useState([]);
  const [selectedDesig, setSelectedDesig] = useState("");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 15;

  // Bulk Selection
  const [selectedEmpCodes, setSelectedEmpCodes] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal State for Viewing/Editing Details
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeEmpCode, setActiveEmpCode] = useState(null);

  // 1. Fetch Departments
  useEffect(() => {
    departmentService
      .getDepartments(1, 100)
      .then((data) => setDepartments(data.results || []));
  }, []);

  // 2. Fetch Designations when Dept changes
  useEffect(() => {
    if (selectedDept) {
      designationService
        .getDesignations(selectedDept, 1, 100)
        .then((data) => setDesignations(data.results || []));
    } else {
      setDesignations([]);
      setSelectedDesig(""); // Reset if dept changes
    }
  }, [selectedDept]);

  // 3. Fetch Employees when Dept, Designation, or Page changes
  const fetchEmployees = async () => {
    if (!selectedDept) {
      setEmployees([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const filters = { department: selectedDept };
      if (selectedDesig) filters.designation = selectedDesig;

      const data = await empService.getEmployees(page, pageSize, filters);
      setEmployees(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
      setSelectedEmpCodes([]);
    } catch (err) {
      setError("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [selectedDept, selectedDesig, page]);

  // Bulk Selection Logic
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmpCodes(employees.map((emp) => emp.employee_code));
    } else {
      setSelectedEmpCodes([]);
    }
  };

  const handleSelectOne = (code) => {
    setSelectedEmpCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleBulkDelete = async () => {
    if (selectedEmpCodes.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedEmpCodes.length} employees?`,
      )
    )
      return;

    setIsDeleting(true);
    try {
      await empService.bulkDeleteEmployees(selectedEmpCodes);
      fetchEmployees();
    } catch (err) {
      alert("Failed to delete employees.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export Logic
  const handleExportExcel = async () => {
    if (!selectedDept) {
      alert("Please select a department to export.");
      return;
    }

    setExporting(true);
    try {
      // Fetch ALL records for the selected filters bypassing pagination limits
      const filters = { department: selectedDept };
      if (selectedDesig) filters.designation = selectedDesig;

      // Requesting a high page size to get all records (assuming standard DB sizes)
      const data = await empService.getEmployees(1, 10000, filters);
      const allEmployees = data.results || [];

      if (allEmployees.length === 0) {
        alert("No employees found to export.");
        setExporting(false);
        return;
      }

      // Sort employees by employee_code in ascending order
      const sortedEmployees = [...allEmployees].sort((a, b) =>
        (a.employee_code || "").localeCompare(
          b.employee_code || "",
          undefined,
          { numeric: true, sensitivity: "base" },
        ),
      );

      // Format data for Excel
      const exportData = sortedEmployees.map((emp, index) => ({
        "S.No.": index + 1,
        "Employee Code": emp.employee_code,
        "First Name": emp.first_name,
        "Last Name": emp.last_name,
        Gender: emp.gender || "N/A",
        Caste: emp.caste_category || "N/A",
        Email: emp.email || "N/A",
        Phone: emp.phone_number || "N/A",
        "Date of Birth": emp.date_of_birth || "N/A",
        Department: emp.department_name,
        Designation: emp.designation_name,
        Theme: emp.theme || "Not Set",
        "Employment Type": emp.employee_type,
        "Date of Joining": emp.date_of_joining || "N/A",
        "Monthly Honorarium": emp.monthly_honorarium || "N/A",
      }));

      // Create Workbook and Worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

      // Generate File Name
      const deptCode =
        departments.find((d) => d.id === Number(selectedDept))?.code || "DEPT";
      const fileName = `Employees_${deptCode}_${new Date().toISOString().split("T")[0]}.xlsx`;

      // Download
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export employees.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Employee Directory
          </h2>
          <p className="text-sm text-gray-500">
            Manage all registered employees in the system.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GovButton
            variant="outline"
            className="gap-2"
            onClick={handleExportExcel}
            disabled={!selectedDept || exporting || loading}
          >
            {exporting ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {exporting ? "Exporting..." : "Export List"}
          </GovButton>
          <GovButton
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/admin/employees/bulk-register")}
          >
            <Upload size={16} /> Bulk Register
          </GovButton>
          <GovButton
            variant="primary"
            className="gap-2"
            onClick={() => navigate("/admin/employees/create")}
          >
            <Plus size={16} /> Register Employee
          </GovButton>
        </div>
      </div>

      <GovCard className="p-0 overflow-hidden flex flex-col min-h-[500px]">
        {/* Department Filter Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-end justify-between gap-4 shrink-0">
          <div className="w-full md:w-72">
            <GovSelect
              label="Select Department to view employees"
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1); // Reset page on filter change
              }}
              options={[
                { value: "", label: "-- Select Department --" },
                ...departments.map((d) => ({
                  value: d.id,
                  label: `${d.code} - ${d.name}`,
                })),
              ]}
            />
          </div>

          {selectedEmpCodes.length > 0 && (
            <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded border border-red-200">
              <span className="text-sm font-semibold text-danger">
                {selectedEmpCodes.length} selected
              </span>
              <GovButton
                variant="danger"
                size="sm"
                className="gap-1"
                onClick={handleBulkDelete}
                disabled={isDeleting}
              >
                <Trash2 size={14} /> Delete Selected
              </GovButton>
            </div>
          )}

          {/* Conditional Designation Filter */}
          {selectedDept && (
            <div className="w-full md:w-64">
              <GovSelect
                label="Filter by Designation"
                value={selectedDesig}
                onChange={(e) => {
                  setSelectedDesig(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "-- All Designations --" },
                  ...designations.map((d) => ({ value: d.id, label: d.name })),
                ]}
              />
            </div>
          )}
        </div>

        {/* Employee Table */}
        {!selectedDept ? (
          <div className="p-12 text-center text-gray-500 flex-1 flex items-center justify-center">
            Please select a department from the dropdown above to view
            employees.
          </div>
        ) : error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center justify-center gap-3 flex-1">
            <p>{error}</p>
            <GovButton
              variant="outline"
              size="sm"
              onClick={fetchEmployees}
              className="gap-2"
            >
              <RefreshCw size={16} /> Retry
            </GovButton>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-x-auto">
              <GovTable>
                <GovTableHeader>
                  <GovTableCell isHeader className="w-12 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-dark rounded border-gray-300 focus:ring-primary-dark cursor-pointer"
                      checked={
                        employees.length > 0 &&
                        selectedEmpCodes.length === employees.length
                      }
                      onChange={handleSelectAll}
                    />
                  </GovTableCell>
                  <GovTableCell isHeader className="w-16 text-center">
                    S.No.
                  </GovTableCell>
                  <GovTableCell isHeader>Emp Code</GovTableCell>
                  <GovTableCell isHeader>Employee Name</GovTableCell>
                  <GovTableCell isHeader>Designation</GovTableCell>
                  <GovTableCell isHeader>Type</GovTableCell>
                  <GovTableCell isHeader className="text-right">
                    Actions
                  </GovTableCell>
                </GovTableHeader>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <GovTableRow hover={false}>
                      <GovTableCell colSpan={7} className="h-32">
                        <div className="flex justify-center items-center h-full">
                          <RefreshCw
                            className="animate-spin text-gray-400"
                            size={24}
                          />
                        </div>
                      </GovTableCell>
                    </GovTableRow>
                  ) : employees.length === 0 ? (
                    <GovTableRow hover={false}>
                      <GovTableCell
                        colSpan={7}
                        className="h-32 text-center text-gray-500"
                      >
                        No employees found in this department.
                      </GovTableCell>
                    </GovTableRow>
                  ) : (
                    employees.map((emp, index) => {
                      const serialNumber = (page - 1) * pageSize + index + 1;
                      return (
                        <GovTableRow
                          key={emp.employee_code}
                          className={
                            selectedEmpCodes.includes(emp.employee_code)
                              ? "bg-blue-50/50"
                              : ""
                          }
                        >
                          <GovTableCell className="text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-primary-dark rounded border-gray-300 focus:ring-primary-dark cursor-pointer"
                              checked={selectedEmpCodes.includes(
                                emp.employee_code,
                              )}
                              onChange={() =>
                                handleSelectOne(emp.employee_code)
                              }
                            />
                          </GovTableCell>
                          <GovTableCell className="text-center text-gray-500 text-sm">
                            {serialNumber}
                          </GovTableCell>
                          <GovTableCell className="font-mono font-bold text-gray-700">
                            {emp.employee_code}
                          </GovTableCell>
                          <GovTableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">
                                {emp.first_name} {emp.last_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {emp.email}
                              </span>
                            </div>
                          </GovTableCell>
                          <GovTableCell>
                            <GovBadge variant="neutral">
                              {emp.designation_name}
                            </GovBadge>
                          </GovTableCell>
                          <GovTableCell>
                            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                              {emp.employee_type}
                            </span>
                          </GovTableCell>
                          <GovTableCell className="text-right">
                            <GovButton
                              variant="outline"
                              size="sm"
                              className="gap-2 text-xs"
                              onClick={() => {
                                setActiveEmpCode(emp.employee_code);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <Eye size={14} /> View
                            </GovButton>
                          </GovTableCell>
                        </GovTableRow>
                      );
                    })
                  )}
                </tbody>
              </GovTable>
            </div>

            {/* Pagination */}
            {!loading && employees.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
                <span className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min((page - 1) * pageSize + 1, totalCount)}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(page * pageSize, totalCount)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {totalCount}
                  </span>{" "}
                  records
                </span>
                <div className="flex gap-2">
                  <GovButton
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev || loading}
                    className="gap-1"
                  >
                    <ChevronLeft size={16} /> Prev
                  </GovButton>
                  <GovButton
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext || loading}
                    className="gap-1"
                  >
                    Next <ChevronRight size={16} />
                  </GovButton>
                </div>
              </div>
            )}
          </>
        )}
      </GovCard>

      {/* Employee Detail / Edit Modal */}
      <GovModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setActiveEmpCode(null);
        }}
        title={`Employee Profile: ${activeEmpCode}`}
        className="max-w-4xl max-h-[90vh]"
      >
        {activeEmpCode && (
          <EmpDetail
            empCode={activeEmpCode}
            onClose={() => setIsDetailModalOpen(false)}
            onRefresh={fetchEmployees}
          />
        )}
      </GovModal>
    </div>
  );
}

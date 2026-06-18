// src/pages/manager/EmpList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { empService } from "../../api/empService";
import { departmentService } from "../../api/deptService";
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
} from "lucide-react";
import { EmpDetail } from "./EmpComps/EmpDetail";
import { useAuth } from "../../contexts/AuthContext";

export function EmpList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(user?.department_id || "");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // 1. Fetch Departments on mount
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await departmentService.getDepartments(1, 100);
        setDepartments(data.results || []);

        // Auto lock manager department
        if (user?.department_id) {
          setSelectedDept(String(user.department_id));
        }
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };

    fetchDepts();
  }, [user]);

  // 2. Fetch Employees when Department or Page changes
  const fetchEmployees = async () => {
    if (!selectedDept) {
      setEmployees([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await empService.getEmployees(page, pageSize, {
        department: selectedDept,
      });
      setEmployees(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
      // Clear selection on page/dept change
      setSelectedEmpCodes([]);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Unable to load employees. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [selectedDept, page]);

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
            onClick={() => navigate("/manager/employees/bulk-register")}
          >
            <Upload size={16} /> Bulk Register
          </GovButton>
          <GovButton
            variant="primary"
            className="gap-2"
            onClick={() => navigate("/manager/employees/create")}
          >
            <Plus size={16} /> Register Employee
          </GovButton>
        </div>
      </div>

      <GovCard className="p-0 overflow-hidden">
        {/* Department Filter Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-end justify-between gap-4">
          <div className="w-full md:w-72">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Department - {user?.department_name}
              </label>
            </div>
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
        </div>

        {/* Employee Table */}
        {!selectedDept ? (
          <div className="p-12 text-center text-gray-500">
            Please select a department from the dropdown above to view
            employees.
          </div>
        ) : error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center gap-3">
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
            <GovTable>
              <GovTableHeader>
                <GovTableCell isHeader className="w-12 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-dark rounded border-gray-300 focus:ring-primary-dark"
                    checked={
                      employees.length > 0 &&
                      selectedEmpCodes.length === employees.length
                    }
                    onChange={handleSelectAll}
                  />
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
                  [...Array(5)].map((_, i) => (
                    <GovTableRow key={i} hover={false}>
                      <GovTableCell colSpan={6} className="h-16">
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                ) : employees.length === 0 ? (
                  <GovTableRow hover={false}>
                    <GovTableCell
                      colSpan={6}
                      className="h-32 text-center text-gray-500"
                    >
                      No employees found in this department.
                    </GovTableCell>
                  </GovTableRow>
                ) : (
                  employees.map((emp) => (
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
                          checked={selectedEmpCodes.includes(emp.employee_code)}
                          onChange={() => handleSelectOne(emp.employee_code)}
                        />
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
                  ))
                )}
              </tbody>
            </GovTable>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600">
                Showing page{" "}
                <span className="font-semibold text-gray-900">{page}</span> of{" "}
                {Math.ceil(totalCount / pageSize) || 1}
                <span className="ml-2">({totalCount} records)</span>
              </span>
              <div className="flex gap-2">
                <GovButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
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

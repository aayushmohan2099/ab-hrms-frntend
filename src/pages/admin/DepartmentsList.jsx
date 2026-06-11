import { useState, useEffect } from "react";
import { departmentService } from "../../api/deptService";
import { GovCard } from "../../components/ui/GovCard";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import { GovButton } from "../../components/ui/GovButton";
import { GovBadge } from "../../components/ui/GovBadge";
import { GovModal } from "../../components/ui/GovModal";
import { Edit, Plus, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import { RegisterDepartment } from "./DeptComps/RegisterDepartment";
import { DeptDetail } from "./DeptComps/DeptDetail";

export function DepartmentsList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 20;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedDept, setSelectedDept] = useState(null);

  const fetchDepartments = async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.getDepartments(
        currentPage,
        pageSize,
      );
      setDepartments(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError("Unable to load departments. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments(page);
  }, [page]);

  const handleNextPage = () => {
    if (hasNext) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (hasPrev) setPage((prev) => prev - 1);
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedDept(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dept) => {
    setModalMode("edit");
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDept(null), 200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
          <p className="text-sm text-gray-500">
            Manage organizational departments and their reporting heads.
          </p>
        </div>
        <GovButton
          variant="primary"
          className="gap-2"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} />
          Add Department
        </GovButton>
      </div>

      <GovCard className="p-0 overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center gap-3">
            <p>{error}</p>
            <GovButton
              variant="outline"
              size="sm"
              onClick={() => fetchDepartments(page)}
              className="gap-2"
            >
              <RefreshCw size={16} /> Retry
            </GovButton>
          </div>
        ) : (
          <>
            <GovTable>
              <GovTableHeader>
                <GovTableCell isHeader>Code</GovTableCell>
                <GovTableCell isHeader>Department Name</GovTableCell>
                <GovTableCell isHeader>Head of Dept</GovTableCell>
                <GovTableCell isHeader>Status</GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Actions
                </GovTableCell>
              </GovTableHeader>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <GovTableRow key={i} hover={false}>
                      <GovTableCell colSpan={5} className="h-16">
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                ) : departments.length === 0 ? (
                  <GovTableRow hover={false}>
                    <GovTableCell
                      colSpan={5}
                      className="h-32 text-center text-gray-500"
                    >
                      No departments found.
                    </GovTableCell>
                  </GovTableRow>
                ) : (
                  departments.map((dept) => (
                    <GovTableRow key={dept.id}>
                      <GovTableCell className="font-mono text-primary-dark font-bold">
                        {dept.code}
                      </GovTableCell>

                      <GovTableCell>
                        <span className="font-semibold text-gray-900">
                          {dept.name}
                        </span>
                      </GovTableCell>

                      <GovTableCell>
                        {dept.head_name ? (
                          <span className="text-gray-800">
                            {dept.head_name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-sm">
                            Not Assigned
                          </span>
                        )}
                      </GovTableCell>

                      <GovTableCell>
                        <GovBadge
                          variant={dept.is_active ? "success" : "danger"}
                        >
                          {dept.is_active ? "Active" : "Inactive"}
                        </GovBadge>
                      </GovTableCell>

                      <GovTableCell className="text-right">
                        <GovButton
                          variant="outline"
                          size="sm"
                          className="gap-2 text-xs"
                          onClick={() => handleOpenEditModal(dept)}
                        >
                          <Edit size={14} /> Manage
                        </GovButton>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                )}
              </tbody>
            </GovTable>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600">
                Showing page{" "}
                <span className="font-semibold text-gray-900">{page}</span> of{" "}
                {Math.ceil(totalCount / pageSize) || 1}
                <span className="ml-2">({totalCount} total records)</span>
              </span>
              <div className="flex gap-2">
                <GovButton
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!hasPrev || loading}
                  className="gap-1"
                >
                  <ChevronLeft size={16} /> Prev
                </GovButton>
                <GovButton
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
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

      <GovModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === "create"
            ? "Register Department"
            : `Manage Department: ${selectedDept?.code}`
        }
      >
        {modalMode === "create" ? (
          <RegisterDepartment
            onSuccess={() => {
              handleCloseModal();
              fetchDepartments(page);
            }}
            onCancel={handleCloseModal}
          />
        ) : (
          <DeptDetail
            deptId={selectedDept?.id}
            onClose={handleCloseModal}
            onRefresh={() => fetchDepartments(page)}
          />
        )}
      </GovModal>
    </div>
  );
}

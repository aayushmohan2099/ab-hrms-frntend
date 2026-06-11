import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Edit,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react";

import { RegisterDepartment } from "./DeptComps/RegisterDepartment";
import { DeptDetail } from "./DeptComps/DeptDetail";
import { DeptDesig } from "./DeptComps/DeptDesig";
import { DeptStruct } from "./DeptComps/DeptStruct";

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

  // Slide-out Panel State
  const [selectedDept, setSelectedDept] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create", "info", "desig", "struct"

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

  // Create Modal
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Manage Panel (Slide-out)
  const handleOpenManagePanel = (dept) => {
    setSelectedDept(dept);
  };

  const handleCloseManagePanel = () => {
    setSelectedDept(null);
  };

  // Option Click -> Opens Modal
  const handleOptionClick = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const quickActionTabs = [
    { id: "info", label: "Department Info" },
    { id: "desig", label: "Designations" },
    { id: "struct", label: "Salary Structure" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative overflow-hidden">
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

      {/* Split Layout Wrapper */}
      <div className="flex gap-6 items-start">
        {/* Left Side: Table */}
        <motion.div
          layout
          className="flex-grow w-full transition-all duration-300"
        >
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
                    {!selectedDept && (
                      <GovTableCell isHeader>Head of Dept</GovTableCell>
                    )}
                    <GovTableCell isHeader>Status</GovTableCell>
                    <GovTableCell isHeader className="text-right">
                      Actions
                    </GovTableCell>
                  </GovTableHeader>

                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <GovTableRow key={i} hover={false}>
                          <GovTableCell
                            colSpan={selectedDept ? 4 : 5}
                            className="h-16"
                          >
                            <div className="animate-pulse flex space-x-4">
                              <div className="h-4 bg-gray-200 rounded w-full"></div>
                            </div>
                          </GovTableCell>
                        </GovTableRow>
                      ))
                    ) : departments.length === 0 ? (
                      <GovTableRow hover={false}>
                        <GovTableCell
                          colSpan={selectedDept ? 4 : 5}
                          className="h-32 text-center text-gray-500"
                        >
                          No departments found.
                        </GovTableCell>
                      </GovTableRow>
                    ) : (
                      departments.map((dept) => (
                        <GovTableRow
                          key={dept.id}
                          className={
                            selectedDept?.id === dept.id ? "bg-blue-50/80" : ""
                          }
                        >
                          <GovTableCell className="font-mono text-primary-dark font-bold">
                            {dept.code}
                          </GovTableCell>

                          <GovTableCell>
                            <span className="font-semibold text-gray-900">
                              {dept.name}
                            </span>
                          </GovTableCell>

                          {!selectedDept && (
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
                          )}

                          <GovTableCell>
                            <GovBadge
                              variant={dept.is_active ? "success" : "danger"}
                            >
                              {dept.is_active ? "Active" : "Inactive"}
                            </GovBadge>
                          </GovTableCell>

                          <GovTableCell className="text-right">
                            <GovButton
                              variant={
                                selectedDept?.id === dept.id
                                  ? "primary"
                                  : "outline"
                              }
                              size="sm"
                              className="gap-2 text-xs"
                              onClick={() => handleOpenManagePanel(dept)}
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
                    <span className="font-semibold text-gray-900">{page}</span>{" "}
                    of {Math.ceil(totalCount / pageSize) || 1}
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
        </motion.div>

        {/* Right Side: Animated Options Panel */}
        <AnimatePresence>
          {selectedDept && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: 50 }}
              animate={{ width: "280px", opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="shrink-0 overflow-hidden"
            >
              <GovCard className="h-full min-h-[400px] flex flex-col border-l-4 border-l-primary-light bg-gray-50/50">
                <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-light mb-1 block">
                      Options
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">
                      {selectedDept.name}
                    </h3>
                  </div>
                  <button
                    onClick={handleCloseManagePanel}
                    className="p-1.5 text-gray-400 hover:text-danger rounded-md hover:bg-red-50 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {quickActionTabs.map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => handleOptionClick(tab.id)}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        y: [0, -5, 0],
                      }}
                      transition={{
                        x: {
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                          delay: index * 0.15,
                        },
                        opacity: { duration: 0.4, delay: index * 0.15 },
                        y: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2 + 0.5,
                        },
                      }}
                      className="px-4 py-4 text-sm font-semibold rounded-lg shadow-sm transition-colors text-left border bg-white text-gray-700 hover:bg-primary-dark hover:text-white border-gray-200"
                    >
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </GovCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal renders standard GovModal, keeping layout exactly as before */}
      <GovModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === "create"
            ? "Register Department"
            : modalMode === "info"
              ? `Manage Department: ${selectedDept?.code}`
              : modalMode === "desig"
                ? `Designations: ${selectedDept?.code}`
                : `Salary Structure: ${selectedDept?.code}`
        }
      >
        {modalMode === "create" && (
          <RegisterDepartment
            onSuccess={() => {
              handleCloseModal();
              fetchDepartments(page);
            }}
            onCancel={handleCloseModal}
          />
        )}
        {modalMode === "info" && selectedDept && (
          <DeptDetail
            deptId={selectedDept.id}
            onClose={handleCloseModal}
            onRefresh={() => fetchDepartments(page)}
          />
        )}
        {modalMode === "desig" && selectedDept && (
          <DeptDesig deptId={selectedDept.id} />
        )}
        {modalMode === "struct" && selectedDept && (
          <DeptStruct deptId={selectedDept.id} />
        )}
      </GovModal>
    </div>
  );
}

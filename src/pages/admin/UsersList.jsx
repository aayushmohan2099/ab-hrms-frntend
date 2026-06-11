// src/pages/admin/UsersList.jsx
import { useState, useEffect } from "react";
import { userManagementService } from "../../api/userMgmnt";
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

// Modal Components
import { CreateUser } from "./UserComps/CreateUser";
import { UserDetail } from "./UserComps/UserDetail";

export function UsersList() {
  const [users, setUsers] = useState([]);
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"

  const fetchUsers = async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userManagementService.getUsers(currentPage, pageSize);
      setUsers(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(
        "Unable to load users. Please check your connection or permissions.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the page number changes
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Pagination Handlers
  const handleNextPage = () => {
    if (hasNext) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (hasPrev) setPage((prev) => prev - 1);
  };

  // Modal Handlers
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedUser(null), 200); // Clear after animation
  };

  // Helper to determine role badge styling
  const getRoleBadgeVariant = (roleName) => {
    if (!roleName) return "neutral";
    const name = roleName.toLowerCase();
    if (name.includes("admin")) return "primary";
    if (name.includes("manager")) return "warning";
    return "neutral";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-500">
            Manage system access, roles, and employee accounts.
          </p>
        </div>
        <GovButton
          variant="primary"
          className="gap-2"
          onClick={() => {
            setModalMode("create");
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} /> Add New User
        </GovButton>
      </div>

      {/* Main Content Card */}
      <GovCard className="p-0 overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center gap-3">
            <p>{error}</p>
            <GovButton
              variant="outline"
              size="sm"
              onClick={() => fetchUsers(page)}
              className="gap-2"
            >
              <RefreshCw size={16} /> Retry
            </GovButton>
          </div>
        ) : (
          <>
            <GovTable>
              <GovTableHeader>
                <GovTableCell isHeader>Emp Code</GovTableCell>
                <GovTableCell isHeader>User</GovTableCell>
                <GovTableCell isHeader>Role</GovTableCell>
                <GovTableCell isHeader>Type</GovTableCell>
                <GovTableCell isHeader>Status</GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Actions
                </GovTableCell>
              </GovTableHeader>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  // Loading Skeleton Rows
                  [...Array(5)].map((_, i) => (
                    <GovTableRow key={i} hover={false}>
                      <GovTableCell colSpan={6} className="h-16">
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                ) : users.length === 0 ? (
                  <GovTableRow hover={false}>
                    <GovTableCell
                      colSpan={6}
                      className="h-32 text-center text-gray-500"
                    >
                      No users found.
                    </GovTableCell>
                  </GovTableRow>
                ) : (
                  users.map((user) => (
                    <GovTableRow key={user.id}>
                      <GovTableCell className="font-mono text-gray-600 font-medium">
                        {user.employee_code || "N/A"}
                      </GovTableCell>

                      <GovTableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {user.username}
                          </span>
                        </div>
                      </GovTableCell>

                      <GovTableCell>
                        {user.role_detail ? (
                          <GovBadge
                            variant={getRoleBadgeVariant(user.role_detail.name)}
                          >
                            {user.role_detail.name}
                          </GovBadge>
                        ) : (
                          <span className="text-gray-400 italic text-sm">
                            Unassigned
                          </span>
                        )}
                      </GovTableCell>

                      <GovTableCell className="text-sm text-gray-600 capitalize">
                        {user.employee_type?.toLowerCase() || "N/A"}
                      </GovTableCell>

                      <GovTableCell>
                        <GovBadge
                          variant={user.is_active ? "success" : "danger"}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </GovBadge>
                      </GovTableCell>

                      <GovTableCell className="text-right">
                        <GovButton
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setModalMode("edit");
                            setSelectedUser(user);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit size={14} /> Manage
                        </GovButton>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                )}
              </tbody>
            </GovTable>

            {/* Pagination Footer */}
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

      {/* Action Modal */}
      <GovModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === "create"
            ? "Create New User"
            : `Manage User: ${selectedUser?.username}`
        }
      >
        {modalMode === "create" ? (
          <CreateUser
            onSuccess={() => {
              handleCloseModal();
              fetchUsers(page);
            }}
            onCancel={handleCloseModal}
          />
        ) : (
          <UserDetail
            userId={selectedUser?.id}
            onClose={handleCloseModal}
            onRefresh={() => fetchUsers(page)}
          />
        )}
      </GovModal>
    </div>
  );
}

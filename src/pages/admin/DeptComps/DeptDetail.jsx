// src/pages/admin/DeptComps/DeptDetail.jsx
import { useState, useEffect } from "react";
import { departmentService } from "../../../api/deptService";
import { GovInput } from "../../../components/ui/GovInput";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSeparator } from "../../../components/ui/GovSeparator";
import { userManagementService } from "../../../api/userMgmnt";

export function DeptDetail({ deptId, onClose, onRefresh }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({});

  const [employeeCodeSearch, setEmployeeCodeSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [selectedHead, setSelectedHead] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const data = await departmentService.getDepartmentById(deptId);
        setFormData({
          name: data.name || "",
          code: data.code || "",
          description: data.description || "",
          head: data.head || "", // User ID
          head_name: data.head_name || "",
        });
      } catch (err) {
        setError("Failed to load department details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [deptId]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!employeeCodeSearch.trim()) {
        setUserResults([]);
        return;
      }

      try {
        const response = await userManagementService.getUsers(1, 10, {
          employee_code: employeeCodeSearch,
        });

        setUserResults(response.results || []);
      } catch (err) {
        console.error("Failed to search users", err);
      }
    };

    const timeout = setTimeout(searchUsers, 300);

    return () => clearTimeout(timeout);
  }, [employeeCodeSearch]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { ...formData };
    if (!payload.head) {
      payload.head = null;
    }

    try {
      await departmentService.updateDepartment(deptId, payload);
      onRefresh();
      onClose();
    } catch (err) {
      const data = err.response?.data;

      if (data?.head?.length) {
        setError(`Department Head Error: ${data.head[0]}`);
      } else if (data?.name?.length) {
        setError(`Department Name Error: ${data.name[0]}`);
      } else if (data?.code?.length) {
        setError(`Department Code Error: ${data.code[0]}`);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError("Failed to create department.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to soft-delete this department?")
    )
      return;
    setSaving(true);
    try {
      await departmentService.deleteDepartment(deptId);
      onRefresh();
      onClose();
    } catch (err) {
      setError("Failed to delete department.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading details...</div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-md">
          <div className="font-semibold text-red-800 mb-1">
            Unable to Update Department
          </div>

          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <GovInput
            id="name"
            label="Department Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <GovInput
            id="code"
            label="Department Code"
            value={formData.code}
            onChange={handleChange}
            className="uppercase"
            required
          />
          <GovInput
            id="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <div className="space-y-2">
            {formData.head_name && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="text-xs text-gray-500 mb-1">
                  Current Department Head
                </div>

                <div className="font-medium text-primary-dark">
                  {formData.head_name}
                </div>
              </div>
            )}
            <GovInput
              id="employee_head_search"
              label="Department Head"
              value={employeeCodeSearch}
              onChange={(e) => setEmployeeCodeSearch(e.target.value)}
              placeholder="Enter Employee Code"
            />

            {selectedHead && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <div className="font-semibold text-green-800">Selected:</div>

                <div className="text-sm">
                  {selectedHead.first_name} {selectedHead.last_name}
                </div>

                <div className="text-xs text-gray-500">
                  {selectedHead.role_name}
                </div>

                <div className="text-xs font-mono text-primary-dark">
                  {selectedHead.employee_code}
                </div>
              </div>
            )}

            {userResults.length > 0 && (
              <div className="border rounded max-h-48 overflow-y-auto">
                {userResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                    onClick={() => {
                      setSelectedHead(user);

                      setFormData((prev) => ({
                        ...prev,
                        head: user.id,
                      }));

                      setEmployeeCodeSearch(user.employee_code);

                      setUserResults([]);
                    }}
                  >
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {user.role_name}
                    </div>

                    <div className="text-xs font-mono text-primary-dark">
                      {user.employee_code}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <GovSeparator className="my-4" />

        {/* Button Layout mapped to match your visual requirement */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 justify-center">
            <GovButton
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete Department
            </GovButton>
            <GovButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </GovButton>
            <GovButton type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </GovButton>
          </div>
        </div>
      </form>
    </div>
  );
}

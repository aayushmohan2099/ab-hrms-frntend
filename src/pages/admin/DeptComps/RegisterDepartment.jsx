// src/pages/admin/DeptComps/RegisterDepartment.jsx
import { useState, useEffect } from "react";
import { departmentService } from "../../../api/deptService";
import { GovInput } from "../../../components/ui/GovInput";
import { GovButton } from "../../../components/ui/GovButton";
import { userManagementService } from "../../../api/userMgmnt";

export function RegisterDepartment({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    head: "", // User ID
  });

  const [employeeCodeSearch, setEmployeeCodeSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [selectedHead, setSelectedHead] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Clean up payload (Django expects null or int for ForeignKey, not an empty string)
    const payload = { ...formData };
    if (!payload.head) {
      payload.head = null;
    }

    try {
      await departmentService.createDepartment(payload);
      onSuccess(); // Triggers parent refresh and closes modal
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
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-md">
          <div className="font-semibold text-red-800 mb-1">
            Unable to Register Department
          </div>

          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <GovInput
          id="name"
          label="Department Name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. National Health Mission"
        />
        <GovInput
          id="code"
          label="Department Code"
          required
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. NHM (Short uppercase)"
          className="uppercase"
        />
        <GovInput
          id="description"
          label="Address"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please specify Department Address to appear on Salary Slip"
        />
        <div className="space-y-2">
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

                  <div className="text-sm text-gray-500">{user.role_name}</div>

                  <div className="text-xs font-mono text-primary-dark">
                    {user.employee_code}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
        <GovButton
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </GovButton>
        <GovButton type="submit" variant="primary" disabled={loading}>
          {loading ? "Registering..." : "Register Department"}
        </GovButton>
      </div>
    </form>
  );
}

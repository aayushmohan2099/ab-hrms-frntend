import { useState, useEffect } from "react";
import { departmentService } from "../../../api/deptService";
import { GovInput } from "../../../components/ui/GovInput";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSeparator } from "../../../components/ui/GovSeparator";

export function DeptDetail({ deptId, onClose, onRefresh }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const data = await departmentService.getDepartmentById(deptId);
        setFormData({
          name: data.name || "",
          code: data.code || "",
          description: data.description || "",
          head: data.head || "", // User ID
        });
      } catch (err) {
        setError("Failed to load department details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [deptId]);

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
      setError("Failed to update department.");
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
        <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
          {error}
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
          <GovInput
            id="head"
            type="number"
            label="Department Head (User ID)"
            value={formData.head}
            onChange={handleChange}
            placeholder="Leave blank if unassigned"
          />
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

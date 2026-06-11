import { useState } from "react";
import { departmentService } from "../../../api/deptService";
import { GovInput } from "../../../components/ui/GovInput";
import { GovButton } from "../../../components/ui/GovButton";

export function RegisterDepartment({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    head: "", // User ID
  });

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
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to create department.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
          {error}
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
          label="Description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional department description"
        />
        <GovInput
          id="head"
          type="number"
          label="Department Head (User ID)"
          value={formData.head}
          onChange={handleChange}
          placeholder="e.g. 5 (Optional)"
        />
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

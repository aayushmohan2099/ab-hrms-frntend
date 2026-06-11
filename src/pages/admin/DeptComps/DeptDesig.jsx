// src/pages/admin/DeptComps/DeptDesig.jsx
import { useState, useEffect } from "react";
import { designationService } from "../../../api/desigService";
import { GovInput } from "../../../components/ui/GovInput";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSeparator } from "../../../components/ui/GovSeparator";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../../components/ui/GovTable";
import { Edit, Trash2, Plus, X } from "lucide-react";

export function DeptDesig({ deptId }) {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const fetchDesignations = async () => {
    setLoading(true);
    setError("");
    try {
      // Assuming 100 page size to keep it simple in the side panel
      const data = await designationService.getDesignations(deptId, 1, 100);
      setDesignations(data.results || []);
    } catch (err) {
      setError("Failed to load designations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, [deptId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: "", code: "", description: "" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (desig) => {
    setEditingId(desig.id);
    setFormData({
      name: desig.name,
      code: desig.code,
      description: desig.description || "",
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: "", code: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await designationService.updateDesignation(deptId, editingId, formData);
      } else {
        await designationService.createDesignation(deptId, formData);
      }
      fetchDesignations();
      handleCloseForm();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to save.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this designation?")) return;
    try {
      await designationService.deleteDesignation(deptId, id);
      fetchDesignations();
    } catch (err) {
      setError("Failed to delete designation.");
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {error && (
        <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Conditional Form Panel */}
      {isFormOpen ? (
        <div className="bg-gray-50 p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-800">
              {editingId ? "Edit Designation" : "New Designation"}
            </h4>
            <button
              onClick={handleCloseForm}
              className="text-gray-400 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <GovInput
              id="name"
              label="Title/Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <GovInput
              id="code"
              label="Unique Code"
              value={formData.code}
              onChange={handleInputChange}
              className="uppercase"
              required
            />
            <GovInput
              id="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <div className="flex justify-end gap-2 pt-2">
              <GovButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseForm}
                disabled={saving}
              >
                Cancel
              </GovButton>
              <GovButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </GovButton>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-end">
          <GovButton
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
            onClick={handleOpenCreate}
          >
            <Plus size={14} /> Add Designation
          </GovButton>
        </div>
      )}

      <GovSeparator />

      {/* Designations Table */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-4 text-sm">
            Loading designations...
          </div>
        ) : designations.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm bg-gray-50 rounded-md border border-dashed border-gray-300">
            No designations found for this department.
          </div>
        ) : (
          <GovTable>
            <GovTableHeader>
              <GovTableCell isHeader>Code</GovTableCell>
              <GovTableCell isHeader>Title</GovTableCell>
              <GovTableCell isHeader className="text-right">
                Actions
              </GovTableCell>
            </GovTableHeader>
            <tbody className="divide-y divide-gray-100">
              {designations.map((desig) => (
                <GovTableRow key={desig.id}>
                  <GovTableCell className="font-mono text-xs font-bold text-gray-600">
                    {desig.code}
                  </GovTableCell>
                  <GovTableCell className="text-sm font-semibold text-gray-800">
                    {desig.name}
                  </GovTableCell>
                  <GovTableCell className="text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(desig)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(desig.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </GovTableCell>
                </GovTableRow>
              ))}
            </tbody>
          </GovTable>
        )}
      </div>
    </div>
  );
}

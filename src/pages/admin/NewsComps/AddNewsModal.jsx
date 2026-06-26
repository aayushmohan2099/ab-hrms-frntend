// src/pages/admin/NewsComps/AddNewsModal.jsx
import { useState } from "react";
import { departmentService } from "../../../api/deptService";
import { GovModal } from "../../../components/ui/GovModal";
import { GovInput } from "../../../components/ui/GovInput";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSeparator } from "../../../components/ui/GovSeparator";

export function AddNewsModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    expiry_date: "",
    is_pinned: false,
  });
  const [newsFile, setNewsFile] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewsFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const submitData = new FormData();
    submitData.append("title", formData.title);

    // Backend expects string format "True"/"False" for FormData booleans in Django
    submitData.append("is_pinned", formData.is_pinned ? "True" : "False");

    if (formData.expiry_date) {
      // Convert local datetime to ISO format or send as is depending on backend expectations.
      // Usually, datetime-local outputs YYYY-MM-DDTHH:mm, which Django parses fine.
      submitData.append("expiry_date", formData.expiry_date);
    }

    if (newsFile) {
      submitData.append("news_file", newsFile);
    }

    try {
      await departmentService.createNews(submitData);
      // Reset form on success
      setFormData({ title: "", expiry_date: "", is_pinned: false });
      setNewsFile(null);
      onSuccess(); // Triggers parent refresh
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to create news item.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GovModal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish New Announcement"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <GovInput
          id="title"
          label="News Title / Headline"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g. Mandatory Compliance Training for Q3"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GovInput
            id="expiry_date"
            type="datetime-local"
            label="Expiry Date (Optional)"
            value={formData.expiry_date}
            onChange={handleChange}
            className="w-full"
          />

          <GovInput
            id="news_file"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            label="Attachment (Optional)"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded border border-gray-200">
          <input
            type="checkbox"
            id="is_pinned"
            checked={formData.is_pinned}
            onChange={handleChange}
            className="w-5 h-5 text-primary-dark rounded border-gray-300 focus:ring-primary-dark cursor-pointer"
          />
          <label
            htmlFor="is_pinned"
            className="text-sm font-semibold text-gray-700 cursor-pointer"
          >
            Pin to top of the News Board
          </label>
        </div>

        <GovSeparator />

        <div className="flex justify-end gap-3 pt-2">
          <GovButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </GovButton>
          <GovButton
            type="submit"
            variant="primary"
            disabled={loading || !formData.title.trim()}
          >
            {loading ? "Publishing..." : "Publish News"}
          </GovButton>
        </div>
      </form>
    </GovModal>
  );
}

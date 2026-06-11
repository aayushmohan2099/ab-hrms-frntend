import { useState, useEffect } from "react";
import { userManagementService } from "../../../api/userMgmnt";
import { GovInput } from "../../../components/ui/GovInput";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSeparator } from "../../../components/ui/GovSeparator";

export function UserDetail({ userId, onClose, onRefresh }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resetPasswordData, setResetPasswordData] = useState(null);

  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);

  // Fetch the user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userManagementService.getUserById(userId);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          employee_type: data.employee_type || "PERMANENT",
          employee_code: data.employee_code || "",
          role: data.role || "", // Role ID
        });
      } catch (err) {
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const updateData = new FormData();
    updateData.append("first_name", formData.first_name);
    updateData.append("last_name", formData.last_name);
    updateData.append("email", formData.email);
    updateData.append("phone_number", formData.phone_number);
    updateData.append("employee_type", formData.employee_type);
    updateData.append("role", formData.role);

    if (profilePic) {
      updateData.append("profile_picture", profilePic);
    }

    try {
      await userManagementService.updateUser(userId, updateData);
      onRefresh(); // Trigger parent refresh
      onClose(); // Close modal
    } catch (err) {
      setError("Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to soft-delete this user?"))
      return;
    setSaving(true);
    try {
      await userManagementService.deleteUser(userId);
      onRefresh();
      onClose();
    } catch (err) {
      setError("Failed to delete user.");
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!window.confirm("Reset user password to an auto-generated one?"))
      return;
    setSaving(true);
    try {
      const res = await userManagementService.resetPassword(userId);
      setResetPasswordData(res.new_password);
    } catch (err) {
      setError("Failed to reset password.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading user details...
      </div>
    );

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Password Reset Display */}
      {resetPasswordData && (
        <div className="bg-green-50 p-4 rounded border border-green-200 mb-4 text-center">
          <p className="text-sm text-green-800 font-semibold mb-1">
            Password Successfully Reset!
          </p>
          <div className="text-3xl font-mono font-bold text-gray-900 bg-white py-2 rounded">
            {resetPasswordData}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Make sure to copy this now.
          </p>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="bg-gray-50 p-3 rounded font-mono text-sm text-gray-600 mb-4">
          Employee Code:{" "}
          <span className="font-bold text-primary-dark">
            {formData.employee_code}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GovInput
            id="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <GovInput
            id="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <GovInput
            id="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <GovInput
            id="phone_number"
            label="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <GovSelect
            id="employee_type"
            label="Employee Type"
            value={formData.employee_type}
            onChange={handleChange}
            options={[
              { value: "PERMANENT", label: "Permanent" },
              { value: "CONTRACT", label: "Contract" },
              { value: "INTERN", label: "Intern" },
              { value: "CONSULTANT", label: "Consultant" },
            ]}
          />
          <GovInput
            id="role"
            type="number"
            label="Role ID"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>

        <GovInput
          id="profile_picture"
          type="file"
          accept="image/*"
          label="Update Profile Picture (Leaves unchanged if blank)"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />

        <GovSeparator className="my-4" />

        {/* Updated Button Layout matching the image */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 justify-center">
            <GovButton
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete User
            </GovButton>
            <GovButton
              type="button"
              variant="outline"
              onClick={handleResetPassword}
              disabled={saving}
            >
              Reset Password
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

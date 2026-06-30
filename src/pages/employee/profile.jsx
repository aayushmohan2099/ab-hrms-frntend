// src/pages/employee/profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { empService } from "../../api/empService";
import { GovCard } from "../../components/ui/GovCard";
import { GovInput } from "../../components/ui/GovInput";
import { GovSelect } from "../../components/ui/GovSelect";
import { GovButton } from "../../components/ui/GovButton";
import { GovSeparator } from "../../components/ui/GovSeparator";
import { GovBadge } from "../../components/ui/GovBadge";

export function EmployeeProfile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);

  // To show image preview
  const [previewUrl, setPreviewUrl] = useState(null);

  const empCode = user?.employee_code;

  useEffect(() => {
    if (!empCode) return;

    const fetchEmployee = async () => {
      try {
        const data = await empService.getEmployeeByCode(empCode);
        // Map nulls to empty strings for controlled inputs
        const sanitizedData = {};
        for (const key in data) {
          sanitizedData[key] = data[key] === null ? "" : data[key];
        }
        setFormData(sanitizedData);
        setPreviewUrl(data.profile_picture);
      } catch (err) {
        setError("Failed to load your profile details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [empCode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMsg("");

    const updateData = new FormData();

    // As an employee self-service page, we restrict what they can edit.
    // E.g., They cannot change their honorarium, department, dates, or PAN/Aadhaar without HR approval.
    const allowedUpdateFields = [
      "first_name",
      "last_name",
      "phone_number",
      "gender",
      "caste_category",
      "pan_number",
      "uan_number",
      "bank_name",
      "bank_account_number",
      "bank_ifsc",
      "bank_branch",
      "address",
      "city",
      "state",
      "pincode",
      "emergency_contact_name",
      "emergency_contact_phone",
      "emergency_contact_relation",
      "job_seeker_id",
    ];

    allowedUpdateFields.forEach((field) => {
      if (formData[field] !== undefined) {
        updateData.append(field, formData[field]);
      }
    });

    if (profilePic) {
      updateData.append("profile_picture", profilePic);
    }

    try {
      await empService.updateEmployee(empCode, updateData);
      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!empCode)
    return (
      <div className="p-6 text-center text-gray-500">
        Employee context missing.
      </div>
    );
  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading your profile...
      </div>
    );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <p className="text-sm text-gray-500">
          Manage your personal and contact information.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
          {successMsg}
        </div>
      )}

      <GovCard>
        {/* Header Info Panel (Read-Only context) */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-light bg-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white border-2 border-primary-light flex items-center justify-center font-bold text-primary-dark text-xl">
                {formData.first_name?.charAt(0)}
                {formData.last_name?.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {formData.first_name} {formData.last_name}
              </h3>
              <p className="text-sm font-mono text-gray-600">
                {formData.employee_code} •{" "}
                <GovBadge variant="success">Active</GovBadge>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              {formData.department_name}
            </p>
            <p className="text-xs text-gray-500">{formData.designation_name}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Read-Only HR Data Section */}
          <section className="opacity-80">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1 flex justify-between items-center">
              <span>Official Employment Details</span>
              <span className="text-xs normal-case font-medium text-gray-400">
                Locked by HR
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GovInput
                id="email_ro"
                label="Official Email"
                value={formData.email}
                disabled
              />
              <GovInput
                id="doj_ro"
                label="Date of Joining"
                value={formData.date_of_joining}
                disabled
              />
              <GovInput
                id="emptype_ro"
                label="Employment Type"
                value={formData.employee_type}
                disabled
              />
              <GovInput
                id="theme_ro"
                label="Theme"
                value={formData.theme}
                disabled
              />
            </div>
          </section>

          <GovSeparator />

          {/* Editable Personal Details */}
          <section>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 border-b border-gray-200 pb-1">
              Personal Information
            </h4>
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
                id="phone_number"
                label="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <GovSelect
                id="caste_category"
                label="Social Category"
                value={formData.caste_category ?? ""}
                onChange={handleChange}
                options={[
                  { value: "", label: "-- Select Category --" },
                  { value: "GEN", label: "General" },
                  { value: "SC", label: "Scheduled Caste" },
                  { value: "ST", label: "Scheduled Tribe" },
                  { value: "OBC", label: "Other Backward Class" },
                  { value: "EWS", label: "Economically Weaker Section" },
                ]}
              />
              <GovSelect
                id="gender"
                label="Gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                  { value: "O", label: "Other" },
                ]}
              />
              <GovInput
                id="job_seeker_id"
                label="Job Seeker ID"
                value={formData.job_seeker_id}
                onChange={handleChange}
              />
              <GovInput
                id="pan_number"
                label="PAN Number"
                value={formData.pan_number}
                onChange={handleChange}
              />
              <GovInput
                id="uan_number"
                label="UAN (EPF)"
                value={formData.uan_number}
                onChange={handleChange}
              />
              <div className="md:col-span-2 mt-2">
                <GovInput
                  id="profile_picture"
                  type="file"
                  accept="image/*"
                  label="Update Profile Picture"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </section>

          {/* Bank Details */}
          <section>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 border-b border-gray-200 pb-1">
              Bank Details (For Salary)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GovInput
                id="bank_name"
                label="Bank Name"
                value={formData.bank_name}
                onChange={handleChange}
              />
              <GovInput
                id="bank_account_number"
                label="Account Number"
                value={formData.bank_account_number}
                onChange={handleChange}
              />
              <GovInput
                id="bank_ifsc"
                label="IFSC Code"
                value={formData.bank_ifsc}
                onChange={handleChange}
              />
              <GovInput
                id="bank_branch"
                label="Branch Name"
                value={formData.bank_branch}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Address & Emergency */}
          <section>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 border-b border-gray-200 pb-1">
              Contact & Emergency
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <GovInput
                  id="address"
                  label="Full Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <GovInput
                id="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
              />
              <GovInput
                id="state"
                label="State"
                value={formData.state}
                onChange={handleChange}
              />
              <GovInput
                id="pincode"
                label="Pincode"
                value={formData.pincode}
                onChange={handleChange}
              />

              <GovInput
                id="emergency_contact_name"
                label="Emergency Contact Name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
              />
              <GovInput
                id="emergency_contact_phone"
                label="Emergency Phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
              />
              <GovInput
                id="emergency_contact_relation"
                label="Relation"
                value={formData.emergency_contact_relation}
                onChange={handleChange}
              />
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-8">
            <GovButton type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving Changes..." : "Save My Profile"}
            </GovButton>
          </div>
        </form>
      </GovCard>
    </div>
  );
}

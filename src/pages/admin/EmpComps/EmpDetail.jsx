// src/pages/admin/EmpComps/EmpDetail.jsx
import { useState, useEffect } from "react";
import { empService } from "../../../api/empService";
import { GovInput } from "../../../components/ui/GovInput";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSeparator } from "../../../components/ui/GovSeparator";
import { GovBadge } from "../../../components/ui/GovBadge";

export function EmpDetail({ empCode, onClose, onRefresh }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await empService.getEmployeeByCode(empCode);
        // Map nulls to empty strings for controlled inputs
        const sanitizedData = {};
        for (const key in data) {
          sanitizedData[key] = data[key] === null ? "" : data[key];
        }
        setFormData(sanitizedData);
      } catch (err) {
        setError("Failed to load employee details.");
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const updateData = new FormData();
    // Append standard fields that are allowed to be updated
    const updateFields = [
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "employee_type",
      "date_of_joining",
      "date_of_birth",
      "date_of_leaving",
      "gender",
      "monthly_honorarium",
      "bank_name",
      "bank_account_number",
      "bank_ifsc",
      "bank_branch",
      "pan_number",
      "uan_number",
      "esic_ip_number",
      "aadhaar_number",
      "address",
      "city",
      "state",
      "pincode",
      "emergency_contact_name",
      "emergency_contact_phone",
      "emergency_contact_relation",
      "job_seeker_id",
      "theme",
    ];

    updateFields.forEach((field) => {
      if (formData[field] !== undefined) {
        updateData.append(field, formData[field]);
      }
    });

    if (profilePic) {
      updateData.append("profile_picture", profilePic);
    }

    try {
      await empService.updateEmployee(empCode, updateData);
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update employee.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading profile data...
      </div>
    );

  return (
    <div className="space-y-6 pb-4">
      {error && (
        <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Header Info Panel */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          {formData.profile_picture ? (
            <img
              src={formData.profile_picture}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-light"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center font-bold text-gray-500 text-xl">
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
              <GovBadge
                variant={formData.is_user_active ? "success" : "danger"}
              >
                {formData.is_user_active ? "Active" : "Inactive"}
              </GovBadge>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">
            {formData.department_name} ({formData.department_code})
          </p>
          <p className="text-xs text-gray-500">{formData.designation_name}</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* Personal Details */}
        <section>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
            Personal Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              id="date_of_birth"
              type="date"
              label="Date of Birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
            <div className="md:col-span-3">
              <GovInput
                id="profile_picture"
                type="file"
                accept="image/*"
                label="Update Profile Picture"
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
            </div>
          </div>
        </section>

        {/* Employment Details */}
        <section>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
            Employment Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              id="date_of_joining"
              type="date"
              label="Date of Joining"
              value={formData.date_of_joining}
              onChange={handleChange}
              required
            />
            <GovInput
              id="date_of_leaving"
              type="date"
              label="Date of Leaving"
              value={formData.date_of_leaving}
              onChange={handleChange}
            />
            <GovInput
              id="monthly_honorarium"
              type="number"
              step="0.01"
              label="Monthly Honorarium (Gross)"
              value={formData.monthly_honorarium}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Job Seeker Details */}
        <section>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
            Job Seeker Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GovInput
              id="job_seeker_id"
              label="Job Seeker ID"
              value={formData.job_seeker_id}
              onChange={handleChange}
            />
            <GovSelect
              id="theme"
              label="Theme"
              value={formData.theme}
              onChange={handleChange}
              options={[
                { value: "", label: "Theme not set by Admin" },
                { value: "Admin & HR", label: "Admin & HR" },
                { value: "Capacity Building", label: "Capacity Building" },
                {
                  value: "Farm Livelihood Allied",
                  label: "Farm Livelihood Allied",
                },
                {
                  value: "Financial Inclusion",
                  label: "Financial Inclusion",
                },
                { value: "FNHW", label: "FNHW" },
                {
                  value: "Institution Building",
                  label: "Institution Building",
                },
                {
                  value: "Knowledge Management & Communication",
                  label: "Knowledge Management & Communication",
                },
                {
                  value: "Micro Enterprise Development",
                  label: "Micro Enterprise Development",
                },
                { value: "MIS", label: "MIS" },
                {
                  value: "Monitoring Evalution and Learning",
                  label: "Monitoring Evalution and Learning",
                },
                { value: "Procurement", label: "Procurement" },
                {
                  value: "Project Development & Implementation",
                  label: "Project Development & Implementation",
                },
                { value: "SISD & Gender", label: "SISD & Gender" },
                {
                  value: "Non Farm Livelihood",
                  label: "Non Farm Livelihood",
                },
                {
                  value: "Enterprise Promotion",
                  label: "Enterprise Promotion",
                },
                { value: "Finance", label: "Finance" },
                {
                  value: "Social Inclusion and Social Development",
                  label: "Social Inclusion and Social Development",
                },
                {
                  value: "Social Mobilisation",
                  label: "Social Mobilisation",
                },
                {
                  value: "Monitoring and Evaluation",
                  label: "Monitoring and Evaluation",
                },
                { value: "Accounts & Finance", label: "Accounts & Finance" },
                { value: "Admin", label: "Admin" },
                {
                  value: "Agriculture (AEP)/NTFP",
                  label: "Agriculture (AEP)/NTFP",
                },
                {
                  value: "Audit/Convergence and Special Projects",
                  label: "Audit/Convergence and Special Projects",
                },
                {
                  value: "Bank Linkage and Interest Subvention",
                  label: "Bank Linkage and Interest Subvention",
                },
                {
                  value: "Community Financial Audit",
                  label: "Community Financial Audit",
                },
                {
                  value: "Community Institution Capacity Building",
                  label: "Community Institution Capacity Building",
                },
                { value: "Convergence", label: "Convergence" },
                {
                  value: "Data Analysis and Documentation",
                  label: "Data Analysis and Documentation",
                },
                { value: "Digital Content", label: "Digital Content" },
                { value: "Digital Finance", label: "Digital Finance" },
                { value: "FNHW & Gender", label: "FNHW & Gender" },
                { value: "HR", label: "HR" },
                {
                  value: "Institutional Building",
                  label: "Institutional Building",
                },
                {
                  value: "Insurance and Pension and Community Fund Management",
                  label: "Insurance and Pension and Community Fund Management",
                },
                { value: "IT & MIS", label: "IT & MIS" },
                {
                  value: "Livelihood Capacity Building and Documentation",
                  label: "Livelihood Capacity Building and Documentation",
                },
                {
                  value: "Livestock Development/Fisheries",
                  label: "Livestock Development/Fisheries",
                },
                {
                  value: "Micro Enterprise Development",
                  label: "Micro Enterprise Development",
                },
                { value: "Model CLF", label: "Model CLF" },
                {
                  value: "Non Farm Convergence",
                  label: "Non Farm Convergence",
                },
                { value: "Online Market", label: "Online Market" },
                {
                  value: "Procurement Goods/Services",
                  label: "Procurement Goods/Services",
                },
                {
                  value: "Production & Quality Control",
                  label: "Production & Quality Control",
                },
                {
                  value: "Staff Training & Development",
                  label: "Staff Training & Development",
                },
                {
                  value: "Supply Chain & Market Linkage",
                  label: "Supply Chain & Market Linkage",
                },
                {
                  value: "SVEP & OSF (Per 10 Blocks)",
                  label: "SVEP & OSF (Per 10 Blocks)",
                },
              ]}
            />
          </div>
        </section>

        {/* Statutory & Bank Details */}
        <section>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
            Compliance & Bank
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GovInput
              id="pan_number"
              label="PAN Number"
              value={formData.pan_number}
              onChange={handleChange}
            />
            <GovInput
              id="aadhaar_number"
              label="Aadhaar Number"
              value={formData.aadhaar_number}
              onChange={handleChange}
            />
            <GovInput
              id="uan_number"
              label="UAN Number (EPF)"
              value={formData.uan_number}
              onChange={handleChange}
            />
            <GovInput
              id="esic_ip_number"
              label="ESIC IP Number"
              value={formData.esic_ip_number}
              onChange={handleChange}
            />

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
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
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

        <GovSeparator className="my-6" />

        <div className="flex flex-wrap justify-between items-center gap-4">
          <GovButton
            type="button"
            variant="outline"
            onClick={() => window.open("#", "_blank")}
          >
            Reset User Password
          </GovButton>

          <div className="flex gap-3">
            <GovButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </GovButton>
            <GovButton type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving Updates..." : "Save Changes"}
            </GovButton>
          </div>
        </div>
      </form>
    </div>
  );
}

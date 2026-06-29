import { useState, useEffect } from "react";
import { userManagementService } from "../../../api/userMgmnt";
import { GovInput } from "../../../components/ui/GovInput";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovButton } from "../../../components/ui/GovButton";
import { CheckCircle2 } from "lucide-react";

import { departmentService } from "../../../api/deptService";

const ROLE_OPTIONS = [
  { value: "1", label: "Administrator" },
  { value: "2", label: "Manager" },
  { value: "3", label: "Employee" },
];

export function CreateUser({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [departments, setDepartments] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    employee_type: "PERMANENT",
    department_id: "", // Requires numeric ID
    role: "", // Requires numeric ID
  });
  const [profilePic, setProfilePic] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getDepartments(1, 500);

        setDepartments(response.results || []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Build Multipart FormData
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) submitData.append(key, formData[key]);
    });
    if (profilePic) {
      submitData.append("profile_picture", profilePic);
    }

    try {
      const response = await userManagementService.createUser(submitData);
      setSuccessData(response); // Store response to show the password
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to create user.",
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN (Big Font Display)
  if (successData) {
    return (
      <div className="text-center py-6 space-y-6">
        <div className="flex justify-center text-green-600 mb-4">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          User Created Successfully!
        </h2>
        <p className="text-gray-600">
          Please copy these credentials immediately. The password will not be
          shown again.
        </p>

        <div className="bg-gray-100 p-6 rounded-lg border-2 border-primary-light inline-block w-full">
          <div className="mb-4">
            <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
              Employee Code
            </span>
            <div className="text-3xl font-mono font-bold text-primary-dark">
              {successData.employee_code}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
              Temporary Password
            </span>
            <div className="text-4xl font-mono font-black text-danger tracking-wider bg-white py-3 rounded shadow-inner mt-1">
              {successData.generated_password}
            </div>
          </div>
        </div>

        <GovButton
          className="w-full mt-4"
          onClick={() => {
            onSuccess(); // Triggers the parent list to refresh and closes modal
          }}
        >
          Done
        </GovButton>
      </div>
    );
  }

  // CREATION FORM
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GovInput
          id="first_name"
          label="First Name"
          required
          value={formData.first_name}
          onChange={handleChange}
        />
        <GovInput
          id="last_name"
          label="Last Name"
          required
          value={formData.last_name}
          onChange={handleChange}
        />
        <GovInput
          id="username"
          label="Username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <GovInput
          id="email"
          type="email"
          label="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
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
            { value: "OUTSOURCED", label: "Out Sourced" },
          ]}
        />

        <GovSelect
          id="department_id"
          label="Department"
          value={formData.department_id}
          onChange={handleChange}
          required
          options={[
            {
              value: "",
              label: "Select Department",
            },
            ...departments.map((dept) => ({
              value: String(dept.id),
              label: dept.code,
            })),
          ]}
        />

        <GovSelect
          id="role"
          label="Role"
          value={formData.role}
          onChange={handleChange}
          required
          options={[
            {
              value: "",
              label: "Select Role",
            },
            ...ROLE_OPTIONS,
          ]}
        />
      </div>

      <GovInput
        id="profile_picture"
        type="file"
        accept="image/*"
        label="Profile Picture (Optional)"
        onChange={handleFileChange}
      />

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
          {loading ? "Creating..." : "Create User"}
        </GovButton>
      </div>
    </form>
  );
}

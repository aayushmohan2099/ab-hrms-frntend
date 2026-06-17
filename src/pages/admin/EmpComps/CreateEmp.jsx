// src/pages/admin/EmpComps/CreateEmp.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { empService } from "../../../api/empService";
import { departmentService } from "../../../api/deptService";
import { designationService } from "../../../api/desigService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovInput } from "../../../components/ui/GovInput";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSeparator } from "../../../components/ui/GovSeparator";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export function CreateEmp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Dropdown Data States
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    employee_type: "PERMANENT",
    department: "",
    designation: "",
    gender: "M",
    date_of_joining: "",
    date_of_birth: "",
    monthly_honorarium: "",
    pan_number: "",
    aadhaar_number: "",
  });
  const [profilePic, setProfilePic] = useState(null);

  // Fetch Departments on Mount
  useEffect(() => {
    departmentService
      .getDepartments(1, 100)
      .then((data) => setDepartments(data.results || []));
  }, []);

  // Fetch Designations when Department changes
  useEffect(() => {
    if (formData.department) {
      designationService
        .getDesignations(formData.department, 1, 100)
        .then((data) => {
          setDesignations(data.results || []);
          // Reset designation if the new department doesn't have it
          setFormData((prev) => ({ ...prev, designation: "" }));
        });
    } else {
      setDesignations([]);
    }
  }, [formData.department]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) submitData.append(key, formData[key]);
    });
    if (profilePic) {
      submitData.append("profile_picture", profilePic);
    }

    try {
      const response = await empService.createEmployee(submitData);
      setSuccessData(response);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to register employee.",
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (successData) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <GovCard className="text-center py-12 px-6">
          <div className="flex justify-center text-green-600 mb-6">
            <CheckCircle2 size={72} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Employee Registered Successfully!
          </h2>
          <p className="text-gray-600 mb-8">
            Please record these generated credentials securely. The password
            will not be shown again.
          </p>

          <div className="bg-gray-50 p-8 rounded-xl border-2 border-primary-light inline-block w-full max-w-lg mb-8">
            <div className="mb-6">
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wider block mb-1">
                Username / Emp Code
              </span>
              <div className="text-2xl font-mono font-bold text-primary-dark bg-white py-2 rounded shadow-sm border border-gray-200">
                {successData.employee_code}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wider block mb-1">
                Temporary Password
              </span>
              <div className="text-3xl font-mono font-black text-danger tracking-wider bg-white py-3 rounded shadow-sm border border-gray-200">
                {successData.generated_password}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <GovButton
              variant="outline"
              onClick={() => navigate("/admin/employees")}
            >
              Return to Directory
            </GovButton>
            <GovButton
              variant="primary"
              onClick={() => {
                setSuccessData(null);
                setFormData({
                  ...formData,
                  first_name: "",
                  last_name: "",
                  email: "",
                  pan_number: "",
                  aadhaar_number: "",
                });
              }}
            >
              Register Another
            </GovButton>
          </div>
        </GovCard>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate("/admin/employees")}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Register New Employee
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the details below to generate a new employee profile and
            user account.
          </p>
        </div>
      </div>

      <GovCard>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-danger text-sm rounded border border-red-200 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary-dark mb-4 border-b-2 border-gray-100 pb-2">
              Organizational Placement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GovSelect
                id="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
                required
                options={[
                  { value: "", label: "Select Department..." },
                  ...departments.map((d) => ({
                    value: d.id,
                    label: `${d.code} - ${d.name}`,
                  })),
                ]}
              />
              <GovSelect
                id="designation"
                label="Designation"
                value={formData.designation}
                onChange={handleChange}
                required
                disabled={!formData.department}
                options={[
                  {
                    value: "",
                    label: formData.department
                      ? "Select Designation..."
                      : "Select Department First",
                  },
                  ...designations.map((d) => ({ value: d.id, label: d.name })),
                ]}
              />
              <GovSelect
                id="employee_type"
                label="Employee Type"
                value={formData.employee_type}
                onChange={handleChange}
                required
                options={[
                  { value: "PERMANENT", label: "Permanent" },
                  { value: "CONTRACT", label: "Contract" },
                  { value: "INTERN", label: "Intern" },
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
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary-dark mb-4 border-b-2 border-gray-100 pb-2">
              Personal Identity
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <GovSelect
                id="gender"
                label="Gender"
                value={formData.gender}
                onChange={handleChange}
                required
                options={[
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                  { value: "O", label: "Other" },
                ]}
              />
              <GovInput
                id="email"
                type="email"
                label="Official Email"
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
                  label="Profile Picture (Optional)"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary-dark mb-4 border-b-2 border-gray-100 pb-2">
              Financial & Compliance (Initial)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GovInput
                id="monthly_honorarium"
                type="number"
                step="0.01"
                label="Base Monthly Honorarium (₹)"
                value={formData.monthly_honorarium}
                onChange={handleChange}
                required
              />
              <GovInput
                id="pan_number"
                label="PAN Number"
                value={formData.pan_number}
                onChange={handleChange}
                className="uppercase"
              />
              <GovInput
                id="aadhaar_number"
                label="Aadhaar Number"
                value={formData.aadhaar_number}
                onChange={handleChange}
              />
            </div>
          </section>

          <GovSeparator />

          <div className="flex justify-end gap-4 pt-2">
            <GovButton
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/employees")}
              disabled={loading}
            >
              Cancel
            </GovButton>
            <GovButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
            >
              {loading ? "Generating Profile..." : "Register Employee"}
            </GovButton>
          </div>
        </form>
      </GovCard>
    </div>
  );
}

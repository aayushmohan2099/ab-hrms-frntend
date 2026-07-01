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
    employee_type: "CONTRACT",
    department: "",
    designation: "",
    gender: "M",
    date_of_joining: "",
    date_of_birth: "",
    monthly_honorarium: "",
    pan_number: "",
    aadhaar_number: "",
    job_seeker_id: "",
    theme: "",
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
                  { value: "OUTSOURCED", label: "Out-sourced" },
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
                  { value: "", label: "Select Theme..." },
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
                    value:
                      "Insurance and Pension and Community Fund Management",
                    label:
                      "Insurance and Pension and Community Fund Management",
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

// src/pages/admin/EmpComps/BulkCreateEmp.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../../../api/deptService";
import { designationService } from "../../../api/desigService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovButton } from "../../../components/ui/GovButton";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../../components/ui/GovTable";
import { ArrowLeft, Download, Info } from "lucide-react";
import { EmpCreator } from "./EmpCreator"; // Import the new EmpCreator component
import { useAuth } from "../../../contexts/AuthContext";

export function BulkCreateEmp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [selectedDept, setSelectedDept] = useState(user?.department_id || "");
  const [selectedDesig, setSelectedDesig] = useState("");

  // Fetch Departments
  useEffect(() => {
    departmentService.getDepartments(1, 100).then((data) => {
      setDepartments(data.results || []);

      // Auto-select manager department
      if (user?.department_id) {
        setSelectedDept(String(user.department_id));
      }
    });
  }, [user]);

  // Fetch Designations when Department selected (to help user find IDs)
  useEffect(() => {
    if (selectedDept) {
      designationService
        .getDesignations(selectedDept, 1, 100)
        .then((data) => setDesignations(data.results || []));
    } else {
      setDesignations([]);
    }
  }, [selectedDept]);

  // ALL Required headers for the CSV based on EmployeeOneShotSerializer
  const requiredHeaders = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "employee_type",
    "department_id",
    "designation_id",
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

  const requiredColumns = [
    "first_name",
    "last_name",
    "email",
    "employee_type",
    "department_id",
    "designation_id",
    "date_of_joining",
    "date_of_birth",
    "gender",
    "monthly_honorarium",
  ];

  const handleDownloadTemplate = () => {
    // Generate empty CSV with headers
    const csvContent =
      "data:text/csv;charset=utf-8," + requiredHeaders.join(",");
    const encodedUri = encodeURI(csvContent);

    // Create temporary link to trigger download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_bulk_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate("/manager/employees")}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Bulk Register Employees
          </h2>
          <p className="text-sm text-gray-500">
            Upload a CSV or Excel file to register multiple employees
            simultaneously.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Upload Form */}
        <div className="md:col-span-1 space-y-6">
          <EmpCreator />

          <GovCard className="bg-blue-50 border-blue-200">
            <div className="flex gap-3 mb-2 text-primary-dark">
              <Info size={20} />
              <h3 className="font-bold">Template</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Download the empty template with correct headers to ensure a
              successful upload.
            </p>
            <GovButton
              variant="outline"
              size="sm"
              className="w-full gap-2 bg-white"
              onClick={handleDownloadTemplate}
            >
              <Download size={14} /> Download CSV Template
            </GovButton>
          </GovCard>
        </div>

        {/* Right Column: Instructions & ID Lookup */}
        <div className="md:col-span-2 space-y-6">
          <GovCard>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
              Required File Headers
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your file must contain these exact column headers (lowercase,
              underscores).
              <br />
              <span className="font-semibold text-primary-dark ml-1">
                Note: Employee Types are OUTSOURCED or CONTRACT
              </span>
              <br />
              <span className="font-semibold text-primary-dark ml-1">
                Note: Genders are M for Male , F for Female and O for Others.
              </span>
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {requiredColumns.map((h) => (
                <span
                  key={h}
                  className="bg-gray-100 border border-gray-300 text-gray-800 font-mono text-xs px-2.5 py-1 rounded"
                >
                  {h}
                </span>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 mt-8">
              System ID Lookup Table
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Use the dropdowns below to find the correct numeric IDs for the
              `department_id` and `designation_id` columns.
            </p>

            <div className="flex gap-4 mb-4">
              {user?.department_id ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <div className="h-10 px-3 flex items-center rounded-md border bg-gray-100 text-gray-700">
                    {user.department_name}
                  </div>
                </div>
              ) : (
                <GovSelect
                  label="Filter by Department"
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setSelectedDesig("");
                  }}
                  options={[
                    { value: "", label: "Select to view IDs..." },
                    ...departments.map((d) => ({
                      value: d.id,
                      label: `${d.code} - ${d.name} (ID: ${d.id})`,
                    })),
                  ]}
                />
              )}
            </div>

            {selectedDept && (
              <GovTable>
                <GovTableHeader>
                  <GovTableCell isHeader>Designation Name</GovTableCell>
                  <GovTableCell isHeader>Code</GovTableCell>
                  <GovTableCell
                    isHeader
                    className="font-bold text-primary-dark"
                  >
                    Required ID
                  </GovTableCell>
                </GovTableHeader>
                <tbody>
                  {designations.length === 0 ? (
                    <GovTableRow hover={false}>
                      <GovTableCell
                        colSpan={3}
                        className="text-center text-gray-500 py-4"
                      >
                        No designations found.
                      </GovTableCell>
                    </GovTableRow>
                  ) : (
                    designations.map((desig) => (
                      <GovTableRow key={desig.id}>
                        <GovTableCell>{desig.name}</GovTableCell>
                        <GovTableCell>{desig.code}</GovTableCell>
                        <GovTableCell className="font-mono font-bold text-primary-dark text-lg">
                          {desig.id}
                        </GovTableCell>
                      </GovTableRow>
                    ))
                  )}
                </tbody>
              </GovTable>
            )}
          </GovCard>
        </div>
      </div>
    </div>
  );
}

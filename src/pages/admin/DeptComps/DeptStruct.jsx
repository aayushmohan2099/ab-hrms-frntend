// src/pages/admin/DeptComps/DeptStruct.jsx
import { useState, useEffect } from "react";
import { salService } from "../../../api/SalService";
import { payrollService } from "../../../api/payrollService";
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

export function DeptStruct({ deptId }) {
  // Loading & Error States
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [savingStruct, setSavingStruct] = useState(false);
  const [savingRules, setSavingRules] = useState(false);
  const [structError, setStructError] = useState("");
  const [rulesError, setRulesError] = useState("");
  const [structSuccess, setStructSuccess] = useState("");
  const [rulesSuccess, setRulesSuccess] = useState("");

  // SECTION 1: Business Rules (Salary Structure) State
  const [structId, setStructId] = useState(null);
  const [structForm, setStructForm] = useState({
    tds_rate: "10.00",
    epf_rate: "12.00",
    esic_rate: "3.85",
    effective_from: "",
    effective_to: "",
    remarks: "",
  });

  // SECTION 2: Payroll Breakup (Designation Rules) State
  const [designationRules, setDesignationRules] = useState([]);
  const [globalBreakupRemarks, setGlobalBreakupRemarks] = useState("");

  // SECTION 3: Custom Salary Structures State
  const [customStructures, setCustomStructures] = useState([]);
  const [selectedCustomEmpCodes, setSelectedCustomEmpCodes] = useState([]);
  const [deletingCustom, setDeletingCustom] = useState(false);

  // Fetch initial data for both sections
  const fetchData = async () => {
    setLoadingInitial(true);
    setStructError("");
    setRulesError("");
    setStructSuccess("");
    setRulesSuccess("");

    try {
      // 1. Fetch Salary Structures
      const structRes = await salService.getSalaryStructures(deptId, 1, 1);
      if (structRes.results && structRes.results.length > 0) {
        const currentStruct = structRes.results[0]; // Get the latest/current active
        setStructId(currentStruct.id);
        setStructForm({
          tds_rate: currentStruct.tds_rate || "10.00",
          epf_rate: currentStruct.epf_rate || "12.00",
          esic_rate: currentStruct.esic_rate || "3.85",
          effective_from: currentStruct.effective_from || "",
          effective_to: currentStruct.effective_to || "",
          remarks: currentStruct.remarks || "",
        });
      }

      // 2. Fetch Designations, Designation Rules, and Custom Salary Structures
      const [desigsRes, rulesRes, customRes] = await Promise.all([
        designationService.getDesignations(deptId, 1, 100),
        payrollService.getDesignationRules(deptId, 1, 100),
        salService.getDepartmentCustomSalaryStructures(deptId, 1, 100),
      ]);

      const designations = desigsRes.results || [];
      const rules = rulesRes.results || [];

      // Merge designations with their existing rules (if any)
      const mergedRules = designations.map((desig) => {
        const existingRule = rules.find((r) => r.designation === desig.id);
        return {
          designation: desig.id,
          designation_name: desig.name,
          ruleId: existingRule ? existingRule.id : null,
          applies_tds: existingRule ? existingRule.applies_tds : false,
          applies_epf: existingRule ? existingRule.applies_epf : false,
          applies_esic: existingRule ? existingRule.applies_esic : false,
        };
      });

      setDesignationRules(mergedRules);

      // Inherit remarks from the first existing rule if applicable
      if (rules.length > 0 && rules[0].remarks) {
        setGlobalBreakupRemarks(rules[0].remarks);
      }

      // Populate custom structures
      setCustomStructures(customRes.results || []);
      setSelectedCustomEmpCodes([]);
    } catch (err) {
      console.error("Error fetching struct data:", err);
      setStructError("Failed to load existing configuration.");
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    if (deptId) {
      fetchData();
    }
  }, [deptId]);

  // Handle Form changes for Section 1
  const handleStructChange = (e) => {
    const { id, value } = e.target;
    setStructForm((prev) => ({ ...prev, [id]: value }));
  };

  // Handle Save for Section 1
  const handleSaveStruct = async (e) => {
    e.preventDefault();
    setSavingStruct(true);
    setStructError("");
    setStructSuccess("");

    // Prepare payload (convert empty strings to null for dates)
    const payload = { ...structForm };
    if (!payload.effective_to) payload.effective_to = null;

    try {
      if (structId) {
        await salService.updateSalaryStructure(deptId, structId, payload);
        setStructSuccess("Salary structure updated successfully.");
      } else {
        const res = await salService.createSalaryStructure(deptId, payload);
        setStructId(res.id);
        setStructSuccess("Salary structure set successfully.");
      }
    } catch (err) {
      setStructError(
        err.response?.data?.detail || "Failed to save salary structure.",
      );
    } finally {
      setSavingStruct(false);
    }
  };

  // Handle Checkbox changes for Section 2
  const handleRuleToggle = (index, field) => {
    const updated = [...designationRules];
    updated[index][field] = !updated[index][field];
    setDesignationRules(updated);
  };

  // Handle Save for Section 2 (Bulk process all designations)
  const handleSaveBreakup = async (e) => {
    e.preventDefault();
    setSavingRules(true);
    setRulesError("");
    setRulesSuccess("");

    try {
      // Create an array of promises for creates and updates
      const promises = designationRules.map((rule) => {
        const payload = {
          designation: rule.designation,
          applies_tds: rule.applies_tds,
          applies_epf: rule.applies_epf,
          applies_esic: rule.applies_esic,
          remarks: globalBreakupRemarks,
        };

        if (rule.ruleId) {
          return payrollService.updateDesignationRule(
            deptId,
            rule.ruleId,
            payload,
          );
        } else {
          return payrollService.createDesignationRule(deptId, payload);
        }
      });

      await Promise.all(promises);

      setRulesSuccess("Payroll breakup rules saved successfully.");

      // Refresh to ensure all ruleIds are correctly synced with backend
      await fetchData();
    } catch (err) {
      console.error(err);
      setRulesError("Failed to save some payroll rules. Please verify data.");
    } finally {
      setSavingRules(false);
    }
  };

  // Handle Custom Structure Selection (Section 3)
  const handleSelectAllCustom = (e) => {
    if (e.target.checked) {
      setSelectedCustomEmpCodes(customStructures.map((cs) => cs.employee_code));
    } else {
      setSelectedCustomEmpCodes([]);
    }
  };

  const handleSelectOneCustom = (code) => {
    setSelectedCustomEmpCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  // Handle Bulk Delete Custom Structure (Section 3)
  const handleBulkDeleteCustom = async () => {
    if (selectedCustomEmpCodes.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete custom salary structures for ${selectedCustomEmpCodes.length} employees?`,
      )
    )
      return;

    setDeletingCustom(true);
    try {
      await salService.bulkDeleteCustomSalaryStructure({
        employee_codes: selectedCustomEmpCodes,
      });
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete custom salary structures.");
    } finally {
      setDeletingCustom(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        Loading configuration metrics...
      </div>
    );
  }

  return (
    <div className="h-full pr-2 space-y-10">
      {/* ============================================================
          SECTION 1: BUSINESS RULES (Salary Structure)
      ============================================================= */}
      <section>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Business Rules</h3>
          <p className="text-sm text-gray-500">
            Set department-level statutory deduction metrics.
          </p>
        </div>

        {structError && (
          <div className="mb-4 p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
            {structError}
          </div>
        )}
        {structSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
            {structSuccess}
          </div>
        )}

        <form
          onSubmit={handleSaveStruct}
          className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GovInput
              id="tds_rate"
              type="number"
              step="0.01"
              label="Tax Deducted at Source (TDS) %"
              value={structForm.tds_rate}
              onChange={handleStructChange}
              required
            />
            <GovInput
              id="epf_rate"
              type="number"
              step="0.01"
              label="Employees Provident Fund (EPF) %"
              value={structForm.epf_rate}
              onChange={handleStructChange}
              required
            />
            <GovInput
              id="esic_rate"
              type="number"
              step="0.01"
              label="Employees State Insurance Corporation (ESIC) %"
              value={structForm.esic_rate}
              onChange={handleStructChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GovInput
              id="effective_from"
              type="date"
              label="Effective From"
              value={structForm.effective_from}
              onChange={handleStructChange}
              required
            />
            <GovInput
              id="effective_to"
              type="date"
              label="Effective To (Optional)"
              value={structForm.effective_to}
              onChange={handleStructChange}
              placeholder="Leave blank if current"
            />
          </div>

          <GovInput
            id="remarks"
            label="Remarks (Optional)"
            value={structForm.remarks}
            onChange={handleStructChange}
          />

          <div className="flex justify-end pt-2">
            <GovButton type="submit" variant="primary" disabled={savingStruct}>
              {savingStruct
                ? "Saving..."
                : structId
                  ? "Update Rules"
                  : "Set Rules"}
            </GovButton>
          </div>
        </form>
      </section>

      <GovSeparator />

      {/* ============================================================
          SECTION 2: PAYROLL BREAKUP (Designation Rules)
      ============================================================= */}
      <section className="pb-4">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Payroll Breakup</h3>
          <p className="text-sm text-gray-500">
            Specify which statutory deductions apply to employees of selected
            designations.
          </p>
        </div>

        {rulesError && (
          <div className="mb-4 p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
            {rulesError}
          </div>
        )}
        {rulesSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
            {rulesSuccess}
          </div>
        )}

        <form onSubmit={handleSaveBreakup} className="space-y-4">
          {designationRules.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm">
              No designations found for this department. Add designations first.
            </div>
          ) : (
            <GovTable>
              <GovTableHeader>
                <GovTableCell isHeader>Designation</GovTableCell>
                <GovTableCell isHeader className="text-center w-24">
                  TDS
                </GovTableCell>
                <GovTableCell isHeader className="text-center w-24">
                  EPF
                </GovTableCell>
                <GovTableCell isHeader className="text-center w-24">
                  ESIC
                </GovTableCell>
              </GovTableHeader>
              <tbody className="divide-y divide-gray-200 bg-white">
                {designationRules.map((rule, index) => (
                  <GovTableRow key={rule.designation} hover={true}>
                    <GovTableCell className="font-medium text-gray-800">
                      {rule.designation_name}
                    </GovTableCell>

                    <GovTableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={rule.applies_tds}
                        onChange={() => handleRuleToggle(index, "applies_tds")}
                        className="w-4 h-4 text-primary-dark rounded border-gray-300 focus:ring-primary-dark cursor-pointer"
                      />
                    </GovTableCell>

                    <GovTableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={rule.applies_epf}
                        onChange={() => handleRuleToggle(index, "applies_epf")}
                        className="w-4 h-4 text-primary-dark rounded border-gray-300 focus:ring-primary-dark cursor-pointer"
                      />
                    </GovTableCell>

                    <GovTableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={rule.applies_esic}
                        onChange={() => handleRuleToggle(index, "applies_esic")}
                        className="w-4 h-4 text-primary-dark rounded border-gray-300 focus:ring-primary-dark cursor-pointer"
                      />
                    </GovTableCell>
                  </GovTableRow>
                ))}
              </tbody>
            </GovTable>
          )}

          {designationRules.length > 0 && (
            <>
              <GovInput
                id="breakup_remarks"
                label="General Remarks (Optional)"
                value={globalBreakupRemarks}
                onChange={(e) => setGlobalBreakupRemarks(e.target.value)}
                placeholder="Remarks appended to these mappings"
              />

              <div className="flex justify-end pt-2">
                <GovButton
                  type="submit"
                  variant="primary"
                  disabled={savingRules}
                >
                  {savingRules
                    ? "Saving..."
                    : designationRules.some((r) => r.ruleId)
                      ? "Update Breakup"
                      : "Set Breakup"}
                </GovButton>
              </div>
            </>
          )}
        </form>
      </section>

      <GovSeparator />

      {/* ============================================================
          SECTION 3: CUSTOM SALARY STRUCTURES
      ============================================================= */}
      <section className="pb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Custom Salary Structures
            </h3>
            <p className="text-sm text-gray-500">
              View and manage employee-specific fixed deduction overrides.
            </p>
          </div>
          {selectedCustomEmpCodes.length > 0 && (
            <GovButton
              variant="danger"
              size="sm"
              onClick={handleBulkDeleteCustom}
              disabled={deletingCustom}
            >
              {deletingCustom
                ? "Deleting..."
                : `Delete Selected (${selectedCustomEmpCodes.length})`}
            </GovButton>
          )}
        </div>

        {customStructures.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm">
            No custom salary structures defined for any employee in this
            department.
          </div>
        ) : (
          <GovTable>
            <GovTableHeader>
              <GovTableCell isHeader className="w-12 text-center">
                <input
                  type="checkbox"
                  checked={
                    selectedCustomEmpCodes.length === customStructures.length &&
                    customStructures.length > 0
                  }
                  onChange={handleSelectAllCustom}
                  className="w-4 h-4 text-primary-dark rounded border-gray-300 focus:ring-primary-dark cursor-pointer"
                />
              </GovTableCell>
              <GovTableCell isHeader>Employee</GovTableCell>
              <GovTableCell isHeader>Designation</GovTableCell>
              <GovTableCell isHeader className="text-right">
                TDS (₹)
              </GovTableCell>
              <GovTableCell isHeader className="text-right">
                EPF (₹)
              </GovTableCell>
              <GovTableCell isHeader className="text-right">
                ESIC (₹)
              </GovTableCell>
              <GovTableCell isHeader>Effective From</GovTableCell>
            </GovTableHeader>
            <tbody className="divide-y divide-gray-200 bg-white">
              {customStructures.map((cs) => (
                <GovTableRow key={cs.id} hover={true}>
                  <GovTableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedCustomEmpCodes.includes(
                        cs.employee_code,
                      )}
                      onChange={() => handleSelectOneCustom(cs.employee_code)}
                      className="w-4 h-4 text-primary-dark rounded border-gray-300 focus:ring-primary-dark cursor-pointer"
                    />
                  </GovTableCell>
                  <GovTableCell>
                    <div className="font-medium text-gray-800">
                      {cs.employee_name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {cs.employee_code}
                    </div>
                  </GovTableCell>
                  <GovTableCell className="text-gray-700">
                    {cs.designation_name}
                  </GovTableCell>
                  <GovTableCell className="text-right font-medium text-danger">
                    {cs.tds_amount}
                  </GovTableCell>
                  <GovTableCell className="text-right font-medium text-danger">
                    {cs.epf_amount}
                  </GovTableCell>
                  <GovTableCell className="text-right font-medium text-danger">
                    {cs.esic_amount}
                  </GovTableCell>
                  <GovTableCell className="text-sm text-gray-600">
                    {cs.effective_from}
                  </GovTableCell>
                </GovTableRow>
              ))}
            </tbody>
          </GovTable>
        )}
      </section>
    </div>
  );
}

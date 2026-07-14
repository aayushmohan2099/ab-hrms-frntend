// src/pages/manager/Payroll/components/ExportPayroll.jsx
import { useState } from "react";
import { GovButton } from "../../../../components/ui/GovButton";
import { Download, RefreshCw } from "lucide-react";
import { payrollService } from "../../../../api/payrollService";
import * as XLSX from "xlsx";

export function ExportPayroll({ departmentId, runId, runDetails }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!departmentId || !runId) return;
    setExporting(true);

    try {
      // Fetch all records by using a large pageSize to bypass pagination
      const data = await payrollService.getPayrollRecords(
        departmentId,
        runId,
        1,
        10000,
      );
      const allRecords = data.results || [];

      if (allRecords.length === 0) {
        alert("No records found to export.");
        return;
      }

      // Format data exactly for Excel
      const exportData = allRecords.map((record, index) => {
        const empCode =
          record.employee?.user?.employee_code || record.employee_code || "N/A";
        const empName = record.employee?.user?.first_name
          ? `${record.employee.user.first_name} ${record.employee.user.last_name || ""}`
          : record.employee_name || "Unknown";

        return {
          "S.No.": index + 1,
          "Employee Code": empCode,
          "Employee Name": empName,
          Designation: record.designation_snapshot || "N/A",
          "Total Working Days": record.total_working_days,
          "Effective Days (Present)": record.days_present,
          "Absent Days": record.days_absent,
          "Basic/Honorarium": record.monthly_honorarium,
          "Gross Pay": record.gross_pay,
          "EPF Deduction": record.epf_amount,
          "ESIC Deduction": record.esic_amount,
          "TDS Deduction": record.tds_amount,
          "Total Deductions": record.total_deductions,
          "Net Pay": record.net_pay,
        };
      });

      // Create Workbook and Worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Records");

      // Generate File Name
      const monthName = runDetails
        ? `${runDetails.pay_month}_${runDetails.pay_year}`
        : "";
      const fileName = `Payroll_Run_${runId}_${monthName}.xlsx`;

      // Download
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export payroll records.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <GovButton
      variant="outline"
      className="gap-2"
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? (
        <RefreshCw size={16} className="animate-spin" />
      ) : (
        <Download size={16} />
      )}
      {exporting ? "Exporting..." : "Export Excel"}
    </GovButton>
  );
}

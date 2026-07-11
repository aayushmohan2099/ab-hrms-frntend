// src/pages/employee/TDSFormList.jsx
import { useState, useEffect, useCallback } from "react";
import { empService } from "../../api/empService";
import { GovCard } from "../../components/ui/GovCard";
import { GovSelect } from "../../components/ui/GovSelect";
import { GovButton } from "../../components/ui/GovButton";
import { GovBadge } from "../../components/ui/GovBadge";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  DownloadCloud,
  FileText,
} from "lucide-react";

export function EmployeeTDSList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 15;

  const [filterYear, setFilterYear] = useState("");
  const [filterQuarter, setFilterQuarter] = useState("");

  const financialYears = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
  const quarters = [
    { value: "Q1", label: "Quarter 1" },
    { value: "Q2", label: "Quarter 2" },
    { value: "Q3", label: "Quarter 3" },
    { value: "Q4", label: "Quarter 4" },
  ];

  const fetchTDSForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (filterYear) filters.financial_year = filterYear;
      if (filterQuarter) filters.quarter = filterQuarter;

      // The backend automatically restricts this to the logged-in user's own forms
      const data = await empService.getTDSForms(page, pageSize, filters);
      setForms(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch (err) {
      console.error("Failed to fetch TDS forms:", err);
      setError("Unable to load your TDS records. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, filterYear, filterQuarter]);

  useEffect(() => {
    fetchTDSForms();
  }, [fetchTDSForms]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="text-primary-dark" size={24} />
          My Tax Documents (Form-16)
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          View and download your quarterly tax deduction certificates.
        </p>
      </div>

      <GovCard className="p-0 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-end gap-4">
          <div className="w-full md:w-48">
            <GovSelect
              label="Financial Year"
              value={filterYear}
              onChange={(e) => {
                setFilterYear(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "-- All Years --" },
                ...financialYears.map((y) => ({ value: y, label: y })),
              ]}
            />
          </div>

          <div className="w-full md:w-48">
            <GovSelect
              label="Quarter"
              value={filterQuarter}
              onChange={(e) => {
                setFilterQuarter(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "-- All Quarters --" },
                ...quarters,
              ]}
            />
          </div>
        </div>

        {/* Table View */}
        {error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center gap-3">
            <p>{error}</p>
            <GovButton
              variant="outline"
              size="sm"
              onClick={fetchTDSForms}
              className="gap-2"
            >
              <RefreshCw size={16} /> Retry
            </GovButton>
          </div>
        ) : (
          <>
            <GovTable>
              <GovTableHeader>
                <GovTableCell isHeader>Financial Year</GovTableCell>
                <GovTableCell isHeader>Quarter</GovTableCell>
                <GovTableCell isHeader>Uploaded On</GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Action
                </GovTableCell>
              </GovTableHeader>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <GovTableRow key={i} hover={false}>
                      <GovTableCell colSpan={4} className="h-16">
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                ) : forms.length === 0 ? (
                  <GovTableRow hover={false}>
                    <GovTableCell
                      colSpan={4}
                      className="h-32 text-center text-gray-500"
                    >
                      No tax documents are currently available for your profile.
                    </GovTableCell>
                  </GovTableRow>
                ) : (
                  forms.map((form) => (
                    <GovTableRow key={form.th_urid}>
                      <GovTableCell>
                        <GovBadge
                          variant="neutral"
                          className="text-sm px-3 py-1"
                        >
                          {form.financial_year}
                        </GovBadge>
                      </GovTableCell>
                      <GovTableCell>
                        <GovBadge
                          variant="primary"
                          className="text-sm px-3 py-1"
                        >
                          {form.quarter}
                        </GovBadge>
                      </GovTableCell>
                      <GovTableCell className="text-gray-600 font-medium">
                        {new Date(form.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </GovTableCell>
                      <GovTableCell className="text-right">
                        {form.form_pdf ? (
                          <GovButton
                            variant="primary"
                            size="sm"
                            className="gap-2 text-xs"
                            onClick={() =>
                              window.open(
                                form.form_pdf.replace(
                                  "/api/v1/",
                                  "/media/",
                                ),
                                "_blank",
                              )
                            }
                          >
                            <DownloadCloud size={16} /> Download PDF
                          </GovButton>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Not Available
                          </span>
                        )}
                      </GovTableCell>
                    </GovTableRow>
                  ))
                )}
              </tbody>
            </GovTable>

            {/* Pagination */}
            {totalCount > pageSize && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <span className="text-sm text-gray-600">
                  Showing page{" "}
                  <span className="font-semibold text-gray-900">{page}</span> of{" "}
                  {Math.ceil(totalCount / pageSize) || 1}
                </span>
                <div className="flex gap-2">
                  <GovButton
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!hasPrev || loading}
                    className="gap-1"
                  >
                    <ChevronLeft size={16} /> Prev
                  </GovButton>
                  <GovButton
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext || loading}
                    className="gap-1"
                  >
                    Next <ChevronRight size={16} />
                  </GovButton>
                </div>
              </div>
            )}
          </>
        )}
      </GovCard>
    </div>
  );
}

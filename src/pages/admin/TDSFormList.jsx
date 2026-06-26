// src/pages/admin/TDSFormList.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { empService } from "../../api/empService";
import { GovCard } from "../../components/ui/GovCard";
import { GovSelect } from "../../components/ui/GovSelect";
import { GovInput } from "../../components/ui/GovInput";
import { GovButton } from "../../components/ui/GovButton";
import { GovBadge } from "../../components/ui/GovBadge";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import {
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  DownloadCloud,
  Search,
} from "lucide-react";

export function TDSFormList() {
  const navigate = useNavigate();

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
  const [searchQuery, setSearchQuery] = useState("");

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
      if (searchQuery) filters.search = searchQuery;

      const data = await empService.getTDSForms(page, pageSize, filters);
      setForms(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch (err) {
      console.error("Failed to fetch TDS forms:", err);
      setError("Unable to load TDS records. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, filterYear, filterQuarter, searchQuery]);

  useEffect(() => {
    fetchTDSForms();
  }, [fetchTDSForms]);

  const handleDelete = async (thUrid) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this TDS Form?",
      )
    )
      return;
    try {
      await empService.deleteTDSForm(thUrid);
      fetchTDSForms();
    } catch (err) {
      alert("Failed to delete the form.");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTDSForms();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            TDS Forms (Form-16)
          </h2>
          <p className="text-sm text-gray-500">
            Manage and distribute quarterly tax deduction certificates to
            employees.
          </p>
        </div>
        <GovButton
          variant="primary"
          className="gap-2"
          onClick={() => navigate("/admin/form-16/upload")}
        >
          <Upload size={16} /> Bulk Upload ZIP
        </GovButton>
      </div>

      <GovCard className="p-0 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-end gap-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 min-w-[200px] flex gap-2 items-end"
          >
            <GovInput
              id="search"
              label="Search Employee"
              placeholder="Emp Code or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <GovButton
              type="submit"
              variant="secondary"
              className="mb-0 h-10 px-3"
            >
              <Search size={18} />
            </GovButton>
          </form>

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
                <GovTableCell isHeader>Employee Code</GovTableCell>
                <GovTableCell isHeader>Employee Name</GovTableCell>
                <GovTableCell isHeader>Financial Year</GovTableCell>
                <GovTableCell isHeader>Quarter</GovTableCell>
                <GovTableCell isHeader>Uploaded On</GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Actions
                </GovTableCell>
              </GovTableHeader>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <GovTableRow key={i} hover={false}>
                      <GovTableCell colSpan={6} className="h-16">
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                ) : forms.length === 0 ? (
                  <GovTableRow hover={false}>
                    <GovTableCell
                      colSpan={6}
                      className="h-32 text-center text-gray-500"
                    >
                      No TDS forms found matching your criteria.
                    </GovTableCell>
                  </GovTableRow>
                ) : (
                  forms.map((form) => (
                    <GovTableRow key={form.th_urid}>
                      <GovTableCell className="font-mono font-bold text-gray-700">
                        {form.employee_code}
                      </GovTableCell>
                      <GovTableCell className="font-semibold text-gray-900">
                        {form.employee_name}
                      </GovTableCell>
                      <GovTableCell>
                        <GovBadge variant="neutral">
                          {form.financial_year}
                        </GovBadge>
                      </GovTableCell>
                      <GovTableCell>
                        <GovBadge variant="primary">{form.quarter}</GovBadge>
                      </GovTableCell>
                      <GovTableCell className="text-gray-500 text-sm">
                        {new Date(form.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </GovTableCell>
                      <GovTableCell className="text-right space-x-2">
                        {form.download_url && (
                          <GovButton
                            variant="outline"
                            size="sm"
                            className="gap-2 text-xs text-primary-dark"
                            onClick={() =>
                              window.open(form.download_url, "_blank")
                            }
                          >
                            <DownloadCloud size={14} /> Download
                          </GovButton>
                        )}
                        <GovButton
                          variant="danger"
                          size="sm"
                          className="px-2"
                          onClick={() => handleDelete(form.th_urid)}
                          title="Delete File"
                        >
                          <Trash2 size={14} />
                        </GovButton>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                )}
              </tbody>
            </GovTable>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600">
                Showing page{" "}
                <span className="font-semibold text-gray-900">{page}</span> of{" "}
                {Math.ceil(totalCount / pageSize) || 1}
                <span className="ml-2">({totalCount} records)</span>
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
          </>
        )}
      </GovCard>
    </div>
  );
}

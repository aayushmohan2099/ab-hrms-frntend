// src/pages/admin/NewsBoard.jsx
import { useState, useEffect } from "react";
import { departmentService } from "../../api/deptService";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import { GovBadge } from "../../components/ui/GovBadge";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import {
  Plus,
  Trash2,
  Pin,
  PinOff,
  Power,
  PowerOff,
  FileText,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { AddNewsModal } from "./NewsComps/AddNewsModal";

export function NewsBoard() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await departmentService.getNews();
      // Adjusting in case API returns paginated data (.results) or straight array
      setNewsList(data.results || data || []);
    } catch (err) {
      console.error("Fetch News Error:", err);
      setError("Failed to load news board.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleTogglePin = async (news) => {
    try {
      const formData = new FormData();
      formData.append("is_pinned", !news.is_pinned ? "True" : "False");
      await departmentService.updateNews(news.th_urid, formData);
      fetchNews();
    } catch (err) {
      alert("Failed to update pinned status.");
    }
  };

  const handleToggleActive = async (news) => {
    if (
      !window.confirm(
        `Are you sure you want to ${news.is_active ? "deactivate" : "activate"} this news item?`,
      )
    )
      return;
    try {
      const formData = new FormData();
      formData.append("is_active", !news.is_active ? "True" : "False");
      await departmentService.updateNews(news.th_urid, formData);
      fetchNews();
    } catch (err) {
      alert("Failed to update active status.");
    }
  };

  const handleDelete = async (thUrid) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this news item?",
      )
    )
      return;
    try {
      await departmentService.deleteNews(thUrid);
      fetchNews();
    } catch (err) {
      alert("Failed to delete news item.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Expiry";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            News & Announcements
          </h2>
          <p className="text-sm text-gray-500">
            Manage public board updates, compliance notices, and general
            circulars.
          </p>
        </div>
        <GovButton
          variant="primary"
          className="gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} /> Publish New
        </GovButton>
      </div>

      <GovCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
            <RefreshCw className="animate-spin text-primary-light" size={24} />
            Loading announcements...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center gap-3">
            <p>{error}</p>
            <GovButton
              variant="outline"
              size="sm"
              onClick={fetchNews}
              className="gap-2"
            >
              <RefreshCw size={16} /> Retry
            </GovButton>
          </div>
        ) : (
          <GovTable>
            <GovTableHeader>
              <GovTableCell isHeader>Title</GovTableCell>
              <GovTableCell isHeader>Dates</GovTableCell>
              <GovTableCell isHeader>Attachment</GovTableCell>
              <GovTableCell isHeader className="text-center">
                Status
              </GovTableCell>
              <GovTableCell isHeader className="text-right">
                Actions
              </GovTableCell>
            </GovTableHeader>
            <tbody className="divide-y divide-gray-100">
              {newsList.length === 0 ? (
                <GovTableRow hover={false}>
                  <GovTableCell
                    colSpan={5}
                    className="h-32 text-center text-gray-500"
                  >
                    No active news or announcements found.
                  </GovTableCell>
                </GovTableRow>
              ) : (
                newsList.map((news) => (
                  <GovTableRow
                    key={news.th_urid}
                    className={news.is_pinned ? "bg-yellow-50/30" : ""}
                  >
                    <GovTableCell>
                      <div className="flex items-center gap-2">
                        {news.is_pinned && (
                          <Pin
                            size={14}
                            className="text-orange-500 fill-orange-500 shrink-0"
                          />
                        )}
                        <span className="font-semibold text-gray-800 whitespace-normal line-clamp-2 max-w-md">
                          {news.title}
                        </span>
                      </div>
                    </GovTableCell>

                    <GovTableCell>
                      <div className="flex flex-col text-xs">
                        <span className="text-gray-500">
                          Pub:{" "}
                          <span className="font-medium text-gray-800">
                            {formatDate(news.publish_date)}
                          </span>
                        </span>
                        <span className="text-gray-500">
                          Exp:{" "}
                          <span className="font-medium text-gray-800">
                            {formatDate(news.expiry_date)}
                          </span>
                        </span>
                      </div>
                    </GovTableCell>

                    <GovTableCell>
                      {news.has_attachment && news.file_url ? (
                        <a
                          href={news.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary-dark hover:text-primary-light text-sm font-medium transition-colors"
                        >
                          <FileText size={16} /> View PDF
                          <ExternalLink size={12} className="opacity-50" />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          None
                        </span>
                      )}
                    </GovTableCell>

                    <GovTableCell className="text-center">
                      <GovBadge
                        variant={news.is_active ? "success" : "neutral"}
                      >
                        {news.is_active ? "Active" : "Inactive"}
                      </GovBadge>
                    </GovTableCell>

                    <GovTableCell className="text-right space-x-2">
                      <button
                        onClick={() => handleTogglePin(news)}
                        title={news.is_pinned ? "Unpin News" : "Pin News"}
                        className={`p-1.5 rounded transition-colors ${news.is_pinned ? "text-orange-600 bg-orange-100 hover:bg-orange-200" : "text-gray-500 bg-gray-100 hover:bg-gray-200"}`}
                      >
                        {news.is_pinned ? (
                          <PinOff size={16} />
                        ) : (
                          <Pin size={16} />
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleActive(news)}
                        title={
                          news.is_active ? "Deactivate News" : "Activate News"
                        }
                        className={`p-1.5 rounded transition-colors ${news.is_active ? "text-blue-600 bg-blue-100 hover:bg-blue-200" : "text-gray-500 bg-gray-100 hover:bg-gray-200"}`}
                      >
                        {news.is_active ? (
                          <PowerOff size={16} />
                        ) : (
                          <Power size={16} />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(news.th_urid)}
                        title="Delete Permanently"
                        className="p-1.5 rounded text-danger bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </GovTableCell>
                  </GovTableRow>
                ))
              )}
            </tbody>
          </GovTable>
        )}
      </GovCard>

      <AddNewsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchNews}
      />
    </div>
  );
}

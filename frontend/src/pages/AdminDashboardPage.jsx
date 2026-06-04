import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Search, Edit3, Trash2, CheckCircle2, XCircle, ExternalLink, RefreshCw } from "lucide-react";
import * as documentService from "../services/documentService";
import { useToast } from "../utils/useToast";
import Table from "../components/Table";
import Badge from "../components/Badge";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import { ROUTES } from "../utils/constants";

export const AdminDashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Tracks id of toggled doc
  const [error, setError] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const toast = useToast();
  const navigate = useNavigate();

  const fetchAdminDocuments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await documentService.getAllAdmin();
      setDocuments(response.data);
    } catch (err) {
      setError("Failed to fetch administrative records. Ensure the backend Mongoose database is running.");
      toast.error("Failed to sync records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDocuments();
  }, []);

  const handleToggleStatus = async (docId) => {
    setActionLoading(docId);
    try {
      const response = await documentService.toggleStatus(docId);
      toast.success(response.data?.message || "Status updated successfully.");
      
      // Update local state smoothly
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.docId === docId ? { ...doc, isActive: response.data?.isActive } : doc
        )
      );
    } catch (err) {
      toast.error("Failed to toggle guideline active status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDocument = async (docId, title) => {
    const confirmed = window.confirm(`Are you absolutely sure you want to delete the guide for "${title}"?\nThis action cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await documentService.deleteDoc(docId);
      toast.success(response.data?.message || "Guideline deleted successfully.");
      setDocuments((prev) => prev.filter((doc) => doc.docId !== docId));
    } catch (err) {
      toast.error("Failed to delete guideline from administrative records.");
    }
  };

  const handleSort = (key, order) => {
    setSortKey(key);
    setSortOrder(order);
  };

  // Local filtering by search query matching document titles
  const filteredDocs = documents.filter((doc) =>
    doc.info.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    let aVal = "";
    let bVal = "";

    if (sortKey === "title") {
      aVal = a.info.title.toLowerCase();
      bVal = b.info.title.toLowerCase();
    } else if (sortKey === "category") {
      aVal = a.category.toLowerCase();
      bVal = b.category.toLowerCase();
    } else if (sortKey === "status") {
      aVal = String(a.isActive);
      bVal = String(b.isActive);
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Calculate Quick Metric stats
  const totalCount = documents.length;
  const activeCount = documents.filter((doc) => doc.isActive).length;
  const inactiveCount = totalCount - activeCount;

  const tableHeaders = [
    { key: "title", label: "Guide Title", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "status", label: "Display Status", sortable: true },
    { key: "actions", label: "Management Actions", sortable: false },
  ];

  return (
    <div className="bg-bg min-h-screen">
      <PageWrapper>
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-black text-text-primary leading-tight">
              Guide Management Desk
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed mt-1">
              Create, modify, toggle displaying states, or delete document application guidelines.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchAdminDocuments}
              className="min-h-[44px] cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
            <Link to={ROUTES.ADMIN_CREATE}>
              <Button variant="primary" size="md" className="min-h-[44px] cursor-pointer">
                <PlusCircle size={15} className="mr-2" /> New Document
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Metric cards - Editorial Neutral design */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 select-none">
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[100px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Total Guide Resources
            </span>
            <span className="text-3xl font-serif font-black text-text-primary mt-2">
              {totalCount}
            </span>
          </div>

          <div className="bg-[#EDF6EF] dark:bg-[#152319] border border-[#D3EAD8] dark:border-[#223929] p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[100px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#256030] dark:text-[#6BCB81]">
              Active Guidelines
            </span>
            <span className="text-3xl font-serif font-black text-[#256030] dark:text-[#6BCB81] mt-2">
              {activeCount}
            </span>
          </div>

          <div className="bg-[#FBF1F1] dark:bg-[#2C1515] border border-[#F6D7D7] dark:border-[#4A2222] p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[100px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A62B2B] dark:text-[#E86D6D]">
              Inactive Guidelines
            </span>
            <span className="text-3xl font-serif font-black text-[#A62B2B] dark:text-[#E86D6D] mt-2">
              {inactiveCount}
            </span>
          </div>
        </div>

        {/* Search controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
          <div className="relative w-full md:max-w-sm">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-surface focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all duration-200 min-h-[44px]">
              <Search size={14} className="text-text-secondary shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guide title…"
                className="bg-transparent text-xs font-semibold text-text-primary placeholder-text-secondary/50 outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Table component */}
        {error && !loading ? (
          <div className="bg-[#FBF1F1] dark:bg-[#2C1515] border border-[#F6D7D7] dark:border-[#4A2222] text-[#A62B2B] dark:text-[#E86D6D] p-6 rounded-2xl text-center max-w-xl mx-auto shadow-sm">
            <h4 className="font-serif font-bold text-lg">Failed to Sync Database</h4>
            <p className="text-xs mt-1.5 leading-relaxed">{error}</p>
          </div>
        ) : (
          <Table
            headers={tableHeaders}
            data={sortedDocs}
            loading={loading}
            emptyMessage={searchQuery ? "No entries match search query." : "Register a new document guideline to get started."}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
            
            // Renders standard Desktop table row markup
            renderRow={(doc) => (
              <tr key={doc.docId} className="hover:bg-bg/40 transition-colors">
                <td className="px-6 py-4.5">
                  <div className="min-w-0 max-w-md">
                    <span className="text-sm font-bold text-text-primary block hover:text-accent cursor-pointer truncate" onClick={() => navigate(`/document/${doc.docId}`)}>
                      {doc.info.title}
                    </span>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mt-1">
                      ID: {doc.docId}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4.5">
                  <Badge variant="category" value={doc.category} />
                </td>
                <td className="px-6 py-4.5 select-none">
                  <button
                    onClick={() => handleToggleStatus(doc.docId)}
                    disabled={actionLoading === doc.docId}
                    className="cursor-pointer focus:outline-none min-h-[36px]"
                    title="Click to toggle display status"
                  >
                    <Badge variant="status" value={doc.isActive ? "active" : "inactive"} className="hover:opacity-85 transition-opacity" />
                  </button>
                </td>
                <td className="px-6 py-4.5">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/document/${doc.docId}`}
                      target="_blank"
                      className="text-text-secondary hover:text-text-primary p-2 hover:bg-surface-muted rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center border border-transparent hover:border-border"
                      title="View public layout"
                    >
                      <ExternalLink size={15} />
                    </Link>
                    <Link
                      to={`/admin/edit/${doc.docId}`}
                      className="text-text-secondary hover:text-accent p-2 hover:bg-surface-muted rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center border border-transparent hover:border-border"
                      title="Edit guideline details"
                    >
                      <Edit3 size={15} />
                    </Link>
                    <button
                      onClick={() => handleDeleteDocument(doc.docId, doc.info.title)}
                      className="text-[#A62B2B] hover:bg-[#FBF1F1] dark:hover:bg-[#2C1515] p-2 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center border border-transparent hover:border-border cursor-pointer"
                      title="Delete guideline"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            // Renders responsive Mobile layout cards stack
            renderCard={(doc) => (
              <div
                key={doc.docId}
                className="bg-surface border border-border rounded-2xl p-5 space-y-4 hover:border-accent/40 shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-text-primary block leading-snug truncate" onClick={() => navigate(`/document/${doc.docId}`)}>
                      {doc.info.title}
                    </span>
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mt-1">
                      ID: {doc.docId}
                    </span>
                  </div>
                  <Badge variant="category" value={doc.category} className="shrink-0" />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4 select-none">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">Status</span>
                    <button
                      onClick={() => handleToggleStatus(doc.docId)}
                      disabled={actionLoading === doc.docId}
                      className="cursor-pointer focus:outline-none mt-1 min-h-[38px]"
                    >
                      <Badge variant="status" value={doc.isActive ? "active" : "inactive"} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/document/${doc.docId}`}
                      target="_blank"
                      className="text-text-secondary hover:text-text-primary p-2 hover:bg-surface-muted rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-border"
                    >
                      <ExternalLink size={15} />
                    </Link>
                    <Link
                      to={`/admin/edit/${doc.docId}`}
                      className="text-text-secondary hover:text-accent p-2 hover:bg-surface-muted rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-border"
                    >
                      <Edit3 size={15} />
                    </Link>
                    <button
                      onClick={() => handleDeleteDocument(doc.docId, doc.info.title)}
                      className="text-[#A62B2B] hover:bg-[#FBF1F1] dark:hover:bg-[#2C1515] p-2 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-border cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        )}
      </PageWrapper>
    </div>
  );
};

export default AdminDashboardPage;

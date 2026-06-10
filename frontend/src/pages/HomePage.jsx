import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, FolderOpen } from "lucide-react";
import * as documentService from "../services/documentService";
import NavBar from "../components/NavBar";
import DocumentCard from "../components/DocumentCard";
import Skeleton from "../components/Skeleton";
import { CATEGORIES } from "../utils/constants";

export default function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("cat") || "";
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError("");
      try {
        let response;
        if (activeCategory) {
          response = await documentService.getByCategory(activeCategory);
          setDocuments(response.data);
        } else {
          response = await documentService.getAll();
          setDocuments(response.data);
        }
      } catch (err) {
        setError(
          "Failed to fetch documents! Please ensure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [activeCategory]);

  const handleCategoryTabClick = (categoryKey) => {
    if (categoryKey === "") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", categoryKey);
    }
    setSearchParams(searchParams);
  };

  // Local client filtering based on search query matching title/tagline/description
  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.info.title.toLowerCase().includes(query) ||
      doc.info.tagline?.toLowerCase().includes(query) ||
      doc.info.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-bg">
      <NavBar />

      <div className="max-w-6xl mx-auto px-5 py-10 md:py-16">
        {/* Editorial Heading */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent select-none">
            FormEZ Guide Center
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-text-primary leading-tight mt-2.5">
            Government Documents Made Simple.
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed mt-4">
            Get clear, step-by-step guidance on gathering requirements, filing
            official links, and executing application steps for Indian public
            systems.
          </p>
        </div>

        {/* Search Box + Filters Section */}
        <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between pb-6 border-b border-border mb-10">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-2 md:pb-0 md:mb-0 scrollbar-none select-none">
            <button
              onClick={() => handleCategoryTabClick("")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-150 shrink-0 cursor-pointer min-h-[38px]
                ${
                  activeCategory === ""
                    ? "bg-text-primary text-white border-text-primary dark:text-bg shadow-sm"
                    : "bg-surface text-text-secondary border-border hover:border-accent hover:text-accent"
                }
              `}
            >
              All Guides
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryTabClick(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-150 shrink-0 cursor-pointer min-h-[38px]
                  ${
                    activeCategory === cat
                      ? "bg-text-primary text-white border-text-primary dark:text-bg shadow-sm"
                      : "bg-surface text-text-secondary border-border hover:border-accent hover:text-accent"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar specifically for mobile/quick filter */}
          <div className="relative w-full md:max-w-xs shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-surface focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all duration-200 min-h-[44px]">
              <Search size={14} className="text-text-secondary shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter these guides…"
                className="bg-transparent text-xs font-semibold text-text-primary placeholder-text-secondary/50 outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        {loading ? (
          // Renders animated grid skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-2xl p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Skeleton variant="rectangle" width="w-12" height="h-12" />
                  <Skeleton width="w-20" height="h-5" />
                </div>
                <Skeleton width="w-3/4" height="h-5" />
                <Skeleton width="w-full" height="h-3" />
                <Skeleton width="w-1/2" height="h-3" />
                <div className="border-t border-border pt-4 mt-2 flex justify-between">
                  <Skeleton width="w-20" height="h-3" />
                  <Skeleton width="w-16" height="h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Renders error message panel
          <div className="bg-[#FBF1F1] dark:bg-[#2C1515] border border-danger/30 text-[#A62B2B] dark:text-[#E86D6D] p-6 rounded-2xl max-w-xl mx-auto text-center shadow-sm">
            <h3 className="font-bold text-lg font-serif">
              Something went wrong
            </h3>
            <p className="text-sm mt-1 leading-relaxed">{error}</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          // Renders visual empty state panel
          <div className="bg-surface border border-border rounded-2xl p-16 text-center max-w-xl mx-auto flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center text-text-secondary/50 mb-4 border border-border">
              <FolderOpen size={26} />
            </div>
            <h3 className="text-xl font-serif font-bold text-text-primary leading-tight">
              No guides match criteria
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mt-2 max-w-sm">
              We couldn't find any guidelines matching your category or search
              filter. Try broadening your keywords.
            </p>
          </div>
        ) : (
          // Renders premium Document cards list
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.docId} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

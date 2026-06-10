import { useState, useEffect, useRef } from "react";
import { FileText, Search, ChevronDown, ArrowRight, X, Sun, Moon, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import * as documentService from "../services/documentService";
import { useTheme } from "../context/ThemeContext";
import { ROUTES } from "../utils/constants";

const NAV_CATEGORIES = [
  {
    label: "Identity",
    to: "/?cat=identity",
    icon: "🪪",
    desc: "Aadhaar, PAN, Passport",
  },
  {
    label: "Vehicle",
    to: "/?cat=vehicle",
    icon: "🚗",
    desc: "RC, Driving License, Permits",
  },
  {
    label: "Property",
    to: "/?cat=property",
    icon: "🏠",
    desc: "Land records, Mutations",
  },
  {
    label: "Education",
    to: "/?cat=education",
    icon: "🎓",
    desc: "Certificates, Marksheets",
  },
  {
    label: "Health",
    to: "/?cat=health",
    icon: "🏥",
    desc: "Medical, Insurance, Schemes",
  },
  {
    label: "Other",
    to: "/?cat=other",
    icon: "📋",
    desc: "Misc government forms",
  },
];

// Custom SVGGithub Icon component - highly compatible, lightweight, and independent
const GH = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { pathname } = useLocation();
  const catRef = useRef(null);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setCatOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fn = (e) => {
      if (catRef.current && !catRef.current.contains(e.target))
        setCatOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await documentService.search(search);
        setSearchResults(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <nav
      className={`sticky top-0 z-50 bg-surface border-b border-border transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center h-16 justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group select-none min-h-[44px]">
            <div className="bg-accent p-[7px] rounded-[10px] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
              <FileText size={18} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[18px] font-serif font-black text-text-primary leading-none tracking-tight">
                Form<span className="text-accent">EZ</span>
              </div>
              <div className="text-[9px] text-text-secondary font-bold tracking-widest uppercase mt-0.5 select-none animate-pulse">
                Govt Process Simplified
              </div>
            </div>
          </Link>

          {/* Search Box - Desktop */}
          <div className="relative flex-1 max-w-sm hidden md:block">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-surface-muted focus-within:border-accent focus-within:bg-surface focus-within:ring-1 focus-within:ring-accent transition-all duration-200 min-h-[40px]">
              <Search size={14} className="text-text-secondary shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents, guidelines…"
                className="bg-transparent text-sm text-text-primary placeholder-text-secondary/50 outline-none w-full"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-text-secondary hover:text-text-primary p-0.5 rounded-full hover:bg-surface-muted transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-surface border border-border shadow-xl max-h-60 overflow-y-auto p-2 z-50">
                {searchResults.map((item) => (
                  <Link
                    key={item.docId}
                    to={`/document/${item.docId}`}
                    onClick={() => setSearch("")}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-muted transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary truncate">
                        {item.info.title}
                      </div>
                      <div className="text-[10px] text-text-secondary truncate mt-0.5">
                        {item.info.description}
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-text-secondary opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-150 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Action Links - Desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-text-secondary hover:text-accent hover:bg-surface-muted border border-border p-2.5 rounded-xl transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title={theme === "dark" ? "Switch to Light parchment" : "Switch to Dark charcoal"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* GitHub Repository Link Button */}
            <a
              href="https://github.com/vishnuuuvrdn/FormEZ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent hover:bg-surface-muted border border-border p-2.5 rounded-xl transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title="View on GitHub"
              aria-label="GitHub repository"
            >
              <GH />
            </a>

            {/* Categories Dropdown Menu */}
            <div ref={catRef} className="relative shrink-0">
              <button
                onClick={() => setCatOpen((o) => !o)}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl border transition-all duration-150 min-h-[44px] cursor-pointer
                  ${
                    catOpen
                      ? "bg-accent text-white border-accent"
                      : "bg-surface text-text-primary border-border hover:border-accent hover:text-accent"
                  }
                `}
              >
                Categories
                <ChevronDown
                  size={12}
                  strokeWidth={2.5}
                  className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
                />
              </button>
              
              <div
                className={`absolute top-[calc(100%+8px)] right-0 w-72 bg-surface border border-border shadow-xl transition-all duration-200 origin-top-right overflow-hidden z-50
                  ${
                    catOpen
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                  }
                `}
              >
                <div className="p-2">
                  <p className="text-[9px] font-bold tracking-widest text-text-secondary uppercase px-3 pt-2 pb-1.5 border-b border-border mb-1.5">
                    Browse Categories
                  </p>
                  {NAV_CATEGORIES.map((c) => (
                    <Link
                      key={c.label}
                      to={c.to}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-100 group hover:bg-surface-muted"
                    >
                      <span className="text-xl leading-none select-none">{c.icon}</span>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                          {c.label}
                        </div>
                        <div className="text-[10px] text-text-secondary truncate mt-0.5">
                          {c.desc}
                        </div>
                      </div>
                      <ArrowRight
                        size={12}
                        className="shrink-0 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-150"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Console button */}
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover rounded-xl px-4 py-2.5 transition-all duration-150 hover:-translate-y-px min-h-[44px]"
            >
              Admin Center <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Action Controls - Mobile */}
          <div className="flex items-center gap-2.5 md:hidden">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-text-secondary hover:text-accent hover:bg-surface-muted border border-border p-2.5 rounded-xl transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title={theme === "dark" ? "Switch to Light parchment" : "Switch to Dark charcoal"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary hover:text-accent hover:bg-surface-muted border border-border p-2.5 rounded-xl transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title="Open menu"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Slide-Down */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface shadow-xl animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Mobile Search Box */}
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-surface-muted focus-within:border-accent focus-within:bg-surface focus-within:ring-1 focus-within:ring-accent transition-all duration-200 min-h-[44px]">
                <Search size={14} className="text-text-secondary shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents, guidelines…"
                  className="bg-transparent text-sm text-text-primary placeholder-text-secondary/50 outline-none w-full"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-text-secondary hover:text-text-primary p-0.5 rounded-full hover:bg-surface-muted transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-surface border border-border shadow-xl max-h-48 overflow-y-auto p-2 z-50 rounded-xl">
                  {searchResults.map((item) => (
                    <Link
                      key={item.docId}
                      to={`/document/${item.docId}`}
                      onClick={() => {
                        setSearch("");
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-muted transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-text-primary truncate">
                          {item.info.title}
                        </div>
                      </div>
                      <ArrowRight size={12} className="text-text-secondary shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Categories Section */}
            <div className="space-y-1">
              <p className="text-[9px] font-bold tracking-widest text-text-secondary uppercase px-2 pb-1 border-b border-border mb-1.5">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {NAV_CATEGORIES.map((c) => (
                  <Link
                    key={c.label}
                    to={c.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl border border-border bg-surface-muted/40 hover:bg-surface-muted transition-colors"
                  >
                    <span className="text-base leading-none select-none">{c.icon}</span>
                    <span className="text-xs font-bold text-text-primary">{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Action Links */}
            <div className="pt-2 border-t border-border flex flex-col gap-2.5">
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover rounded-xl px-4 py-3 transition-colors min-h-[44px]"
              >
                <span>Admin Center</span>
                <ArrowRight size={13} strokeWidth={2.5} />
              </Link>

              <a
                href="https://github.com/vishnuuuvrdn/FormEZ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary border border-border rounded-xl py-3 hover:bg-surface-muted transition-all min-h-[44px]"
              >
                <GH />
                <span>View GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

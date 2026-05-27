import { useState, useEffect, useRef } from "react";
import { FileText, Search, ChevronDown, ArrowRight, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";

const NAV_CATEGORIES = [
  {
    label: "Identity",
    to: "/",
    icon: "🪪",
    desc: "Aadhaar, PAN, Passport",
  },
  {
    label: "Vehicle",
    to: "/vehicle",
    icon: "🚗",
    desc: "RC, Driving License, Permits",
  },
  {
    label: "Property",
    to: "/property",
    icon: "🏠",
    desc: "Land records, Mutations",
  },
  {
    label: "Education",
    to: "/",
    icon: "🎓",
    desc: "Certificates, Marksheets",
  },
  {
    label: "Health",
    to: "/",
    icon: "🏥",
    desc: "Medical, Insurance, Schemes",
  },
  { label: "Other", to: "/", icon: "📋", desc: "Misc government forms" },
];

const GH = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { pathname } = useLocation();
  const catRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setCatOpen(false);
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
        const response = await api.get(`/documents/search`, {
          params: { q: search },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const active = (p) => pathname === p;

  return (
    <nav
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="bg-blue-600 p-[7px] rounded-[10px] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
              <FileText size={19} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[19px] font-extrabold text-gray-900 leading-none tracking-tight">
                Form<span className="text-blue-600">EZ</span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">
                Govt Process Simplified
              </div>
            </div>
          </Link>

          <div className="relative flex-1 max-w-sm mx-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] transition-all duration-200">
              <Search size={15} className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search forms, categories…"
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.12)] max-h-60 overflow-y-auto p-2 z-50">
                {searchResults.map((item) => (
                  <Link
                    key={item.id || item._id}
                    to={item.to || `/document/${item.id || item._id}`}
                    onClick={() => setSearch("")}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {item.title || item.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div ref={catRef} className="relative shrink-0">
            <button
              onClick={() => setCatOpen((o) => !o)}
              className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl border transition-all duration-150 ${catOpen ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600"}`}
            >
              Categories
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`absolute top-[calc(100%+8px)] left-0 w-72 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-200 origin-top-left overflow-hidden ${catOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}
            >
              <div className="p-2">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-3 pt-2 pb-1.5">
                  Browse by Category
                </p>
                {NAV_CATEGORIES.map((c) => (
                  <Link
                    key={c.label}
                    to={c.to}
                    onClick={() => setCatOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-100 group ${active(c.to) ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
                    <span className="text-xl leading-none">{c.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-semibold ${active(c.to) ? "text-blue-700" : "text-gray-800 group-hover:text-blue-700"}`}
                      >
                        {c.label}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        {c.desc}
                      </div>
                    </div>
                    <ArrowRight
                      size={13}
                      className={`shrink-0 transition-opacity duration-100 ${active(c.to) ? "text-blue-500 opacity-100" : "text-gray-300 opacity-0 group-hover:opacity-100"}`}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/vishnuuuvrdn/FormEZ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 rounded-xl px-3 py-2 transition-all duration-150 shrink-0"
          >
            <GH /> GitHub
          </a>

          {/* Action button */}
          <Link
            to="/start"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2 transition-all duration-150 hover:-translate-y-px shrink-0"
          >
            Get Started <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

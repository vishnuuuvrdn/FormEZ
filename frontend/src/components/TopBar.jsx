import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, ChevronDown, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useAuth } from "../utils/useAuth";
import { useTheme } from "../context/ThemeContext";
import { ROUTES } from "../utils/constants";

export const TopBar = ({ title = "Dashboard" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getInitials = (name) => {
    if (!name) return "A";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-surface border-b border-border fixed top-0 right-0 left-0 md:left-auto md:w-[calc(100%-16rem)] z-30 flex items-center justify-between px-6 shadow-sm">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-[11px] font-bold text-text-secondary uppercase tracking-widest select-none">
          <Link to={ROUTES.ADMIN_DASHBOARD} className="hover:text-accent flex items-center gap-1 transition-colors">
            <LayoutDashboard size={10} /> Admin
          </Link>
          <span>/</span>
          <span className="text-text-primary">{title}</span>
        </div>
        <h2 className="text-base font-serif font-bold text-text-primary leading-tight">
          {title}
        </h2>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Admin Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="text-text-secondary hover:text-accent hover:bg-surface-muted border border-border p-2.5 rounded-xl transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          title={theme === "dark" ? "Switch to Light parchment" : "Switch to Dark charcoal"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface hover:border-accent hover:bg-surface-muted transition-all duration-150 min-h-[44px] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent font-bold text-xs shrink-0 select-none">
              {getInitials(user?.username)}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none shrink-0 pr-1">
              <span className="text-xs font-bold text-text-primary">
                {user?.username || "Admin User"}
              </span>
              <span className="text-[10px] text-text-secondary mt-0.5 max-w-[120px] truncate">
                {user?.email || "admin@formez.com"}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-text-secondary transition-transform duration-200 shrink-0
                ${dropdownOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-surface border border-border rounded-2xl shadow-xl p-2 z-50 animate-scale-up">
              <div className="px-3 py-2.5 border-b border-border mb-1.5 flex flex-col gap-0.5">
                <span className="text-xs font-bold text-text-primary">
                  {user?.username}
                </span>
                <span className="text-[10px] text-text-secondary truncate">
                  {user?.email}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#A62B2B] hover:bg-[#FBF1F1] dark:hover:bg-[#2C1515] hover:text-[#8D2323] transition-all duration-150 text-left text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <LogOut size={16} />
                Logout Session
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;

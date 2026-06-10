import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Globe, LogOut, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useIsMobile } from "../utils/useIsMobile";
import { useAuth } from "../utils/useAuth";
import { ROUTES } from "../utils/constants";

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const links = [
    {
      label: "Dashboard",
      to: ROUTES.ADMIN_DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      label: "New Form",
      to: ROUTES.ADMIN_CREATE,
      icon: PlusCircle,
    },
    {
      label: "Public Portal",
      to: ROUTES.HOME,
      icon: Globe,
    },
  ];

  const active = (to) => pathname === to;

  // Render Mobile Bottom Tab Bar
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border z-40 flex justify-around items-center px-2 shadow-lg">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = active(link.to);
          return (
            <Link
              key={link.label}
              to={link.to}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] gap-1 transition-colors
                ${isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"}
              `}
            >
              <Icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
                {link.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] gap-1 text-[#A62B2B] hover:text-[#8D2323] cursor-pointer"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
            Logout
          </span>
        </button>
      </nav>
    );
  }

  // Render Desktop Collapsible Sidebar
  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 bg-surface border-r border-border z-40 flex flex-col justify-between transition-all duration-300 shadow-sm
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="flex flex-col gap-6">
        {/* Sidebar Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-5 bg-surface">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 overflow-hidden select-none">
            <div className="bg-accent p-[7px] rounded-[10px] transition-transform duration-300">
              <FileText size={18} color="white" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div>
                <div className="text-lg font-serif font-black text-text-primary leading-none tracking-tight">
                  Form<span className="text-accent">EZ</span>
                </div>
                <div className="text-[9px] text-text-secondary font-semibold tracking-wider uppercase mt-0.5">
                  Admin Shell
                </div>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors p-1.5 rounded-lg cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col gap-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = active(link.to);
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 group relative
                  ${
                    isActive
                      ? "bg-surface-muted text-accent font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-accent rounded-r-md" />
                )}
                <Icon
                  size={20}
                  className={`transition-colors shrink-0
                    ${isActive ? "text-accent" : "text-text-secondary group-hover:text-text-primary"}
                  `}
                />
                {!collapsed && (
                  <span className="text-sm font-semibold tracking-wide">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Actions */}
      <div className="p-3 border-t border-border flex flex-col gap-2">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-3 text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-xl transition-colors cursor-pointer"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        ) : null}
        
        <button
          onClick={logout}
          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[#A62B2B] hover:text-[#8D2323] hover:bg-[#FBF1F1] dark:hover:bg-[#2C1515] transition-all duration-150 w-full text-left font-semibold cursor-pointer
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm tracking-wide">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

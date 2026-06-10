import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export const MainLayout = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const getPageTitle = (path) => {
    if (path === "/admin" || path === "/admin/") return "Dashboard Center";
    if (path === "/admin/new") return "Create Document Guide";
    if (path.includes("/admin/edit")) return "Edit Document Guide";
    return "Administration Panel";
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* Navigation Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main administrative body */}
      <div
        className={`flex-1 flex flex-col min-h-screen pt-16 transition-all duration-300 ${
          collapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Page Top Bar */}
        <TopBar title={getPageTitle(pathname)} collapsed={collapsed} />

        {/* Content canvas */}
        <main className="flex-1 w-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export const MainLayout = () => {
  const { pathname } = useLocation();

  const getPageTitle = (path) => {
    if (path === "/admin" || path === "/admin/") return "Dashboard Center";
    if (path === "/admin/new") return "Create Document Guide";
    if (path.includes("/admin/edit")) return "Edit Document Guide";
    return "Administration Panel";
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main administrative body */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen pt-16">
        {/* Page Top Bar */}
        <TopBar title={getPageTitle(pathname)} />

        {/* Content canvas */}
        <main className="flex-1 w-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

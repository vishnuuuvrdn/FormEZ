import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import { ROUTES } from "../utils/constants";

export const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  // If already authenticated, bypass login/register and go straight to admin panel
  if (!loading && isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl p-8 relative overflow-hidden transition-all duration-300">
        {/* Editorial parchment background design details */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;

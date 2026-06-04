import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import Skeleton from "../components/Skeleton";

export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show premium animated loading state while resolving authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-bg p-8 flex flex-col gap-6 items-center justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex gap-4 items-center">
            <Skeleton variant="circle" width="w-12" height="h-12" />
            <div className="space-y-2 flex-1">
              <Skeleton width="w-1/4" height="h-4" />
              <Skeleton width="w-1/2" height="h-3" />
            </div>
          </div>
          <Skeleton variant="rectangle" width="w-full" height="h-64" />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

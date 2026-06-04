import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import DocumentPage from "../pages/DocumentPage";
import LoginPage from "../pages/LoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminDocumentFormPage from "../pages/AdminDocumentFormPage";
import NotFoundPage from "../pages/NotFoundPage";

import PrivateRoute from "./PrivateRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import { ROUTES } from "../utils/constants";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.DOCUMENT} element={<DocumentPage />} />

      {/* Authentication Pages (Protected by AuthLayout to redirect already logged in users) */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      {/* Protected Admin Pages */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN_CREATE} element={<AdminDocumentFormPage />} />
          <Route path={ROUTES.ADMIN_EDIT} element={<AdminDocumentFormPage />} />
        </Route>
      </Route>

      {/* Fallback 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

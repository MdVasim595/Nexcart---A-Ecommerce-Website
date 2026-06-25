import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  return sessionStorage.getItem("adminToken") ? children : <Navigate to="/admin-login" replace />;
};

export default AdminProtectedRoute;

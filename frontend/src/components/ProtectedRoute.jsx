import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/register" />;
  }

  return children;
};

export default ProtectedRoute;

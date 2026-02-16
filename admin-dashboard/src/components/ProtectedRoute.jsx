import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../lib/auth.js";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default ProtectedRoute;

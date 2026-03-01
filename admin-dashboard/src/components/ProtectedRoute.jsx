import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSessionUser } from "../lib/auth.js";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      const user = await getSessionUser();
      if (!mounted) return;
      setAuthenticated(Boolean(user));
      setChecking(false);
    };

    verify();
    return () => {
      mounted = false;
    };
  }, []);

  if (checking) {
    return <div className="text-slate-500 p-6">Checking session...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

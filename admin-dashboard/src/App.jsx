import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
const Login = lazy(() => import("./pages/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const Skills = lazy(() => import("./pages/Skills.jsx"));
const Experience = lazy(() => import("./pages/Experience.jsx"));
const Education = lazy(() => import("./pages/Education.jsx"));
const Socials = lazy(() => import("./pages/Socials.jsx"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500">Loading admin...</div>}>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="skills" element={<Skills />} />
          <Route path="experience" element={<Experience />} />
          <Route path="education" element={<Education />} />
          <Route path="socials" element={<Socials />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;

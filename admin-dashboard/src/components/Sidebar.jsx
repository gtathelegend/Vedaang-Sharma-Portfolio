import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/experience", label: "Experience" },
  { to: "/admin/education", label: "Education" },
  { to: "/admin/socials", label: "Social Links" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-6">
      <div className="text-xl font-semibold mb-8">Portfolio Admin</div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-white text-slate-900"
                  : "text-slate-200 hover:bg-slate-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="text-xs text-slate-400">Admin only</div>
    </aside>
  );
};

export default Sidebar;

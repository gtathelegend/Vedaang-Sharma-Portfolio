import { useEffect, useState } from "react";
import api from "../lib/api.js";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, skills, experience, education, socials] = await Promise.all([
          api.get("/api/projects"),
          api.get("/api/skills"),
          api.get("/api/experience"),
          api.get("/api/education"),
          api.get("/api/socials"),
        ]);

        setStats({
          projects: projects.data.data.length,
          skills: skills.data.data.length,
          experience: experience.data.data.length,
          education: education.data.data.length,
          socials: socials.data.data.length,
        });
      } catch (error) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-slate-500">Loading stats...</div>;
  }

  if (!stats) {
    return <div className="text-red-600">Failed to load dashboard stats.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500 uppercase">{key}</p>
            <p className="text-3xl font-semibold mt-2">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

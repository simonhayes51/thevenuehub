import { useEffect, useState } from "react";
import { FaBolt, FaFire, FaStar, FaUsers, FaCalendar } from "react-icons/fa";
import SubmissionsPanel from "@/components/admin/SubmissionsPanel.jsx";

const API = import.meta.env.VITE_API_BASE || "";

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("vh_admin_token") || "");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveToken = () => {
    localStorage.setItem("vh_admin_token", token.trim());
    alert("Token saved");
    loadStats();
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/admin/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) loadStats(); }, []);

  const statCards = [
    { label: "Acts", value: stats?.acts || 0, icon: FaBolt, gradient: "from-[#00fff9] to-[#9b5cff]" },
    { label: "Venues", value: stats?.venues || 0, icon: FaFire, gradient: "from-[#ff2a6d] to-[#fffc00]" },
    { label: "Bookings", value: stats?.bookings || 0, icon: FaCalendar, gradient: "from-[#05ffa1] to-[#00fff9]" },
    { label: "Pending Reviews", value: stats?.pending_reviews || 0, icon: FaStar, gradient: "from-[#fffc00] to-[#ff2a6d]" },
    { label: "Submissions", value: stats?.pending_submissions || 0, icon: FaUsers, gradient: "from-[#9b5cff] to-[#ff2a6d]" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-5xl font-black mb-8 neon-text">ADMIN DASHBOARD</h1>

      <div className="flex items-center gap-3 mb-8">
        <input
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Paste Bearer token here"
          className="flex-1"
        />
        <button onClick={saveToken} className="btn">SAVE TOKEN</button>
      </div>

      {stats && (
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="card p-6 spotlight">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="text-2xl" />
                </div>
                <div>
                  <div className="text-3xl font-black">{stat.value}</div>
                  <div className="text-sm opacity-70">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-8 flex-wrap">
        <a href="/acts" className="pill">Acts</a>
        <a href="/venues" className="pill">Venues</a>
        <a href="/bookings" className="pill">Bookings</a>
        <a href="/reviews" className="pill">Reviews</a>
        <a href="/admin" className="pill bg-[#9b5cff]/40 border-[#9b5cff]">Submissions</a>
      </div>

      <SubmissionsPanel />
    </div>
  );
}

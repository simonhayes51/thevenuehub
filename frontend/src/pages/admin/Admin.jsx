// src/pages/admin/Admin.jsx
import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/,"") || "";

function useToken() {
  const [token, setToken] = useState(() => localStorage.getItem("vh_admin_token") || "");
  const save = (t) => { localStorage.setItem("vh_admin_token", t); setToken(t); };
  const clear = () => { localStorage.removeItem("vh_admin_token"); setToken(""); };
  return { token, save, clear };
}

function Section({ title, endpoint, token, columns, rowKey = "id" }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const headers = useMemo(() => {
    const h = { "Accept": "application/json" };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  }, [token]);

  const load = async () => {
    if (!endpoint) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}${endpoint}`, { headers });
      const j = await r.json();
      setRows(Array.isArray(j) ? j : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [endpoint, token]);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={load} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-white/70">
            <tr>
              {columns.map(c => (
                <th key={c.key} className="px-3 py-2 border-b border-white/10">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td className="px-3 py-5 text-white/60" colSpan={columns.length}>No data</td></tr>
            )}
            {rows.map(r => (
              <tr key={r[rowKey]} className="odd:bg-white/0 even:bg-white/5">
                {columns.map(c => (
                  <td key={c.key} className="px-3 py-2 align-top">
                    {c.render ? c.render(r) : (r[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Admin() {
  const { token, save, clear } = useToken();
  const [active, setActive] = useState("acts");
  const [tmpToken, setTmpToken] = useState(token);

  const tabs = [
    { id: "acts",        label: "Acts",        ep: "/api/admin/acts" },
    { id: "venues",      label: "Venues",      ep: "/api/admin/venues" },
    { id: "bookings",    label: "Bookings",    ep: "/api/admin/bookings" },
    { id: "reviews",     label: "Reviews",     ep: "/api/admin/reviews" },
    { id: "submissions", label: "Submissions", ep: "/api/admin/submissions" },
  ];

  const cols = {
    acts: [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "location", label: "Location" },
      { key: "price_from", label: "From" },
      { key: "premium", label: "Premium" },
    ],
    venues: [
      { key: "id", label: "ID" },
      { key: "name", label: "Venue" },
      { key: "location", label: "Location" },
      { key: "capacity", label: "Capacity" },
      { key: "price_from", label: "From" },
      { key: "premium", label: "Premium" },
    ],
    bookings: [
      { key: "id", label: "ID" },
      { key: "customer_name", label: "Name" },
      { key: "customer_email", label: "Email" },
      { key: "date", label: "Date" },
      { key: "message", label: "Message" },
      { key: "act_id", label: "Act ID" },
      { key: "venue_id", label: "Venue ID" },
    ],
    reviews: [
      { key: "id", label: "ID" },
      { key: "rating", label: "★" },
      { key: "comment", label: "Comment" },
      { key: "author_name", label: "Author" },
      { key: "act_id", label: "Act" },
      { key: "venue_id", label: "Venue" },
      { key: "status", label: "Status" },
    ],
    submissions: [
      { key: "id", label: "ID" },
      { key: "role", label: "Role" },
      {
        key: "payload", label: "Payload",
        render: (r) => <code className="text-xs">{JSON.stringify(r.payload || r.payload_json || {}, null, 0)}</code>
      },
      { key: "status", label: "Status" },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="flex items-center gap-2">
          <input
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-[360px] outline-none"
            placeholder="Paste Bearer token here"
            value={tmpToken}
            onChange={(e) => setTmpToken(e.target.value)}
          />
          <button onClick={() => save(tmpToken)} className="px-3 py-2 rounded-lg bg-emerald-500 text-black font-medium">Save</button>
          {token && <button onClick={clear} className="px-3 py-2 rounded-lg bg-white/10">Clear</button>}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-3 py-1.5 rounded-lg border ${active===t.id ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Section
        title={tabs.find(x => x.id === active)?.label || ""}
        endpoint={tabs.find(x => x.id === active)?.ep || ""}
        token={token}
        columns={cols[active]}
      />
    </div>
  );
}

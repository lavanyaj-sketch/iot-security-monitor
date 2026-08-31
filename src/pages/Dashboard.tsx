import { Cpu, ShieldAlert, Activity, ArrowUpRight, TriangleAlert as AlertTriangle, Info } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "../components/StatCard";
import { SeverityPill } from "../components/Pills";
import {
  devices,
  threatEvents,
  alerts,
  activityLog,
  trafficData,
  threatTrend,
  deviceTypeBreakdown,
} from "../data/mockData";

const tooltipStyle = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-default)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--text-primary)",
};

export default function Dashboard() {
  const onlineCount = devices.filter((d) => d.status === "online").length;
  const criticalThreats = threatEvents.filter(
    (t) => t.severity === "critical" || t.severity === "high"
  ).length;
  const activeAlertCount = alerts.filter((a) => a.status === "active").length;
  const totalTraffic = devices.reduce((sum, d) => sum + d.networkIn + d.networkOut, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Security Overview</h1>
        <p className="page-subtitle">
          Real-time monitoring across {devices.length} registered devices —{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: 20 }}>
        <StatCard
          label="Devices Online"
          value={`${onlineCount}/${devices.length}`}
          icon={<Cpu size={20} />}
          trend={{ value: "2.1%", up: true }}
          accent="primary"
        />
        <StatCard
          label="Active Threats"
          value={criticalThreats}
          icon={<ShieldAlert size={20} />}
          trend={{ value: "12%", up: false }}
          accent="error"
        />
        <StatCard
          label="Active Alerts"
          value={activeAlertCount}
          icon={<AlertTriangle size={20} />}
          trend={{ value: "3", up: false }}
          accent="warning"
        />
        <StatCard
          label="Network Traffic"
          value={`${totalTraffic.toFixed(1)} MB/s`}
          icon={<Activity size={20} />}
          trend={{ value: "8.4%", up: true }}
          accent="success"
        />
      </div>

      {/* Charts row */}
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Network Traffic — Last 24 Hours</div>
              <div className="card-subtitle">Inbound vs outbound bandwidth across all devices</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="inbound"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#inGrad)"
                name="Inbound MB/s"
              />
              <Area
                type="monotone"
                dataKey="outbound"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#outGrad)"
                name="Outbound MB/s"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Device Types</div>
              <div className="card-subtitle">Distribution by category</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={deviceTypeBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {deviceTypeBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-list">
            {deviceTypeBreakdown.map((d) => (
              <div className="legend-item" key={d.name}>
                <span className="legend-dot" style={{ background: d.color }} />
                <span className="legend-label">{d.name}</span>
                <span className="legend-value">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threat trend + Activity */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Threat Trends — Past 7 Days</div>
              <div className="card-subtitle">Detected by severity level</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={threatTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(148,163,184,0.05)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="high" stackId="a" fill="#f59e0b" />
              <Bar dataKey="medium" stackId="a" fill="#3b82f6" />
              <Bar dataKey="low" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Live Activity Log</div>
              <div className="card-subtitle">Most recent system events</div>
            </div>
          </div>
          <div className="activity-list">
            {activityLog.slice(0, 8).map((log) => (
              <div className="activity-item" key={log.id}>
                <div className={`activity-icon ${log.level}`}>
                  {log.level === "error" ? (
                    <AlertTriangle size={14} />
                  ) : log.level === "warning" ? (
                    <AlertTriangle size={14} />
                  ) : (
                    <Info size={14} />
                  )}
                </div>
                <div className="activity-body">
                  <div className="activity-action">{log.action}</div>
                  <div className="activity-meta">
                    {log.deviceName} · {log.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent threats table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Threats</div>
            <div className="card-subtitle">Latest detected security events</div>
          </div>
          <button className="btn btn-ghost">
            View all <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Device</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Source</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {threatEvents.slice(0, 5).map((t) => (
                <tr key={t.id}>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                    {t.id}
                  </td>
                  <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{t.deviceName}</td>
                  <td>{t.type}</td>
                  <td><SeverityPill severity={t.severity} /></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{t.source}</td>
                  <td style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{t.timestamp}</td>
                  <td>
                    <span className={`pill ${t.status === "resolved" ? "pill-success" : t.status === "investigating" ? "pill-warning" : "pill-neutral"}`}>
                      <span className="pill-dot" />
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

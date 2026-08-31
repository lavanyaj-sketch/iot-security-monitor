import { useState } from "react";
import { Bell, CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle } from "lucide-react";
import { alerts, AlertItem, AlertStatus } from "../data/mockData";
import { SeverityPill } from "../components/Pills";

const statusFilters: { key: AlertStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "acknowledged", label: "Acknowledged" },
  { key: "resolved", label: "Resolved" },
];

export default function Alerts() {
  const [filter, setFilter] = useState<AlertStatus | "all">("all");

  const filtered = alerts.filter((a) => filter === "all" || a.status === filter);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Alert Center</h1>
        <p className="page-subtitle">
          {alerts.filter((a) => a.status === "active").length} active alerts requiring attention
        </p>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {statusFilters.map((f) => (
          <button
            key={f.key}
            className={`filter-tab ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="filter-tab-count">
              {f.key === "all" ? alerts.length : alerts.filter((a) => a.status === f.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="alert-list">
        {filtered.map((a) => (
          <AlertRow key={a.id} alert={a} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <CheckCircle2 size={32} />
          <p>No alerts in this category.</p>
        </div>
      )}
    </div>
  );
}

function AlertRow({ alert: a }: { alert: AlertItem }) {
  const statusCls = a.status === "active" ? "pill-error" : a.status === "acknowledged" ? "pill-warning" : "pill-success";
  const statusLabel = a.status.charAt(0).toUpperCase() + a.status.slice(1);

  return (
    <div className="alert-row animate-in">
      <div className={`alert-row-icon ${a.severity}`}>
        {a.severity === "critical" || a.severity === "high" ? (
          <AlertTriangle size={18} />
        ) : (
          <Bell size={18} />
        )}
      </div>
      <div className="alert-row-body">
        <div className="alert-row-title">{a.title}</div>
        <div className="alert-row-msg">{a.message}</div>
        <div className="alert-row-meta">
          <span>{a.deviceName}</span>
          <span className="alert-row-dot" />
          <span><Clock size={12} /> {a.timestamp}</span>
        </div>
      </div>
      <div className="alert-row-side">
        <SeverityPill severity={a.severity} />
        <span className={`pill ${statusCls}`}>
          <span className="pill-dot" />
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

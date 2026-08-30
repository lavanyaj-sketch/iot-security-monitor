import { ShieldAlert, ExternalLink, Filter } from "lucide-react";
import { threatEvents } from "../data/mockData";
import { SeverityPill } from "../components/Pills";

export default function Threats() {
  const sorted = [...threatEvents].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Threat Intelligence</h1>
        <p className="page-subtitle">
          {threatEvents.length} detected threats — {threatEvents.filter((t) => t.status === "open").length} open,{" "}
          {threatEvents.filter((t) => t.status === "investigating").length} investigating
        </p>
      </div>

      <div className="threat-list">
        {sorted.map((t) => (
          <div key={t.id} className="threat-card animate-in">
            <div className={`threat-severity-bar ${t.severity}`} />
            <div className="threat-card-body">
              <div className="threat-card-top">
                <div className="threat-card-title-row">
                  <div className="threat-icon-wrap">
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <div className="threat-type">{t.type}</div>
                    <div className="threat-device">{t.deviceName}</div>
                  </div>
                </div>
                <SeverityPill severity={t.severity} />
              </div>

              <p className="threat-desc">{t.description}</p>

              <div className="threat-card-footer">
                <div className="threat-meta">
                  <span className="threat-meta-item">ID: {t.id}</span>
                  <span className="threat-meta-item">Source: {t.source}</span>
                  <span className="threat-meta-item">{t.timestamp}</span>
                </div>
                <div className="threat-actions">
                  <span className={`pill ${t.status === "resolved" ? "pill-success" : t.status === "investigating" ? "pill-warning" : "pill-neutral"}`}>
                    <span className="pill-dot" />
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </span>
                  <button className="btn-icon" title="Investigate">
                    <ExternalLink size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sorted.length === 0 && (
        <div className="empty-state">
          <Filter size={32} />
          <p>No threats detected. Your network is clear.</p>
        </div>
      )}
    </div>
  );
}

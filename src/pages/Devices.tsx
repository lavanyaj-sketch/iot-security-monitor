import { useState } from "react";
import { Search, Filter, Cpu, Thermometer, HardDrive, Wifi, ShieldCheck, ShieldOff } from "lucide-react";
import { devices, IoTDevice } from "../data/mockData";
import { StatusPill } from "../components/Pills";

const typeFilters = ["All", "online", "warning", "critical", "offline"];

export default function Devices() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = devices.filter((d) => {
    const matchesQuery =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.ip.includes(query) ||
      d.type.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || d.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Device Inventory</h1>
        <p className="page-subtitle">{devices.length} registered devices across your network</p>
      </div>

      <div className="filter-bar">
        <div className="header-search" style={{ maxWidth: 320 }}>
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search by name, IP, or type..."
            className="header-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {typeFilters.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="device-grid">
        {filtered.map((d) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <Filter size={32} />
          <p>No devices match your filters.</p>
        </div>
      )}
    </div>
  );
}

function DeviceCard({ device: d }: { device: IoTDevice }) {
  return (
    <div className="device-card animate-in">
      <div className="device-card-top">
        <div className="device-card-icon">
          <Cpu size={18} />
        </div>
        <StatusPill status={d.status} />
      </div>
      <div className="device-card-name">{d.name}</div>
      <div className="device-card-type">{d.type}</div>
      <div className="device-card-meta">
        <span>{d.location}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{d.ip}</span>
      </div>

      <div className="device-metrics">
        <Metric icon={<Cpu size={13} />} label="CPU" value={`${d.cpu}%`} pct={d.cpu} />
        <Metric icon={<HardDrive size={13} />} label="MEM" value={`${d.memory}%`} pct={d.memory} />
        <Metric icon={<Thermometer size={13} />} label="TEMP" value={`${d.temperature}°C`} pct={Math.min(d.temperature, 100)} />
      </div>

      <div className="device-card-footer">
        <div className="device-net">
          <Wifi size={13} />
          <span>{d.networkIn.toFixed(1)} / {d.networkOut.toFixed(1)} MB/s</span>
        </div>
        <div className={`device-enc ${d.encryption ? "on" : "off"}`}>
          {d.encryption ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
          {d.encryption ? "Encrypted" : "Unencrypted"}
        </div>
      </div>
      {d.vulnerabilities > 0 && (
        <div className="device-vuln">
          {d.vulnerabilities} known vulnerability{d.vulnerabilities > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

function Metric({ icon, label, value, pct }: { icon: React.ReactNode; label: string; value: string; pct: number }) {
  const color = pct > 80 ? "var(--c-error-500)" : pct > 60 ? "var(--c-warning-500)" : "var(--c-primary-500)";
  return (
    <div className="metric">
      <div className="metric-top">
        <span className="metric-label">{icon} {label}</span>
        <span className="metric-value">{value}</span>
      </div>
      <div className="metric-bar">
        <div className="metric-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

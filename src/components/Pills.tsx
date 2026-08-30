import { DeviceStatus, ThreatSeverity } from "../data/mockData";

export function StatusPill({ status }: { status: DeviceStatus }) {
  const map: Record<DeviceStatus, { label: string; cls: string }> = {
    online: { label: "Online", cls: "pill-success" },
    warning: { label: "Warning", cls: "pill-warning" },
    critical: { label: "Critical", cls: "pill-error" },
    offline: { label: "Offline", cls: "pill-neutral" },
  };
  const m = map[status];
  return (
    <span className={`pill ${m.cls}`}>
      <span className="pill-dot" />
      {m.label}
    </span>
  );
}

export function SeverityPill({ severity }: { severity: ThreatSeverity }) {
  const map: Record<ThreatSeverity, string> = {
    low: "pill-success",
    medium: "pill-warning",
    high: "pill-error",
    critical: "pill-error",
  };
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  return (
    <span className={`pill ${map[severity]}`}>
      <span className="pill-dot" />
      {label}
    </span>
  );
}

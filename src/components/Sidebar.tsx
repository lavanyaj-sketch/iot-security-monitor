import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Cpu,
  ShieldAlert,
  Network,
  Bell,
  Settings,
  ShieldCheck,
  Brain,
  Workflow,
  Sparkles,
  Link2,
  Info,
  Crosshair,
} from "lucide-react";
import clsx from "clsx";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/about", label: "About Project", icon: Info },
  { to: "/devices", label: "Devices", icon: Cpu },
  { to: "/threats", label: "Threats", icon: ShieldAlert },
  { to: "/network", label: "Network", icon: Network },
  { to: "/pipeline", label: "ML Pipeline", icon: Workflow },
  { to: "/federated-learning", label: "Federated Learning", icon: Brain },
  { to: "/xai", label: "XAI Explainability", icon: Sparkles },
  { to: "/blockchain", label: "Trust & Blocking", icon: Link2 },
  { to: "/idex", label: "iDEX Defence Analysis", icon: Crosshair },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <ShieldCheck size={20} />
        </div>
        <div>
          <div className="sidebar-brand-name">SentinelIoT</div>
          <div className="sidebar-brand-sub">Defence Security Monitor</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx("sidebar-link", { active: isActive })
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <div className="sidebar-status-dot" />
          <div>
            <div className="sidebar-status-label">System Status</div>
            <div className="sidebar-status-value">All monitors running</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

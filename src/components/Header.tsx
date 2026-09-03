import { useState } from "react";
import { Search, Bell, RefreshCw, FileDown, Play, LogOut } from "lucide-react";
import { alerts } from "../data/mockData";
import { useAuth } from "../lib/auth";
import { exportPdfReport } from "../lib/report";

interface HeaderProps {
  onStartPresentation: () => void;
}

export default function Header({ onStartPresentation }: HeaderProps) {
  const activeAlerts = alerts.filter((a) => a.status === "active").length;
  const { user, signOut } = useAuth();
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await exportPdfReport();
    } finally {
      setExporting(false);
    }
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "OP";

  return (
    <header className="header">
      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search devices, threats, IPs..."
          className="header-search-input"
        />
      </div>

      <div className="header-actions">
        <button className="header-action-btn" onClick={handleExport} disabled={exporting} title="Export PDF Report">
          <FileDown size={16} />
          <span>{exporting ? "Generating..." : "Export Report"}</span>
        </button>
        <button className="header-action-btn pres-trigger" onClick={onStartPresentation} title="Demo Presentation Mode">
          <Play size={16} />
          <span>Present</span>
        </button>
        <button className="btn-icon" title="Refresh data">
          <RefreshCw size={18} />
        </button>
        <button className="header-bell" title="Notifications">
          <Bell size={18} />
          {activeAlerts > 0 && <span className="header-bell-badge">{activeAlerts}</span>}
        </button>
        <div className="header-user">
          <div className="header-user-avatar">{initials}</div>
          <div className="header-user-info">
            <div className="header-user-name">{user?.email ?? "Operator"}</div>
            <div className="header-user-role">Defence Operator</div>
          </div>
          <button className="header-signout" onClick={() => signOut()} title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}

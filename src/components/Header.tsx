import { Search, Bell, RefreshCw } from "lucide-react";
import { alerts } from "../data/mockData";

export default function Header() {
  const activeAlerts = alerts.filter((a) => a.status === "active").length;

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
        <button className="btn-icon" title="Refresh data">
          <RefreshCw size={18} />
        </button>
        <button className="header-bell" title="Notifications">
          <Bell size={18} />
          {activeAlerts > 0 && <span className="header-bell-badge">{activeAlerts}</span>}
        </button>
        <div className="header-user">
          <div className="header-user-avatar">JM</div>
          <div className="header-user-info">
            <div className="header-user-name">Jordan Morgan</div>
            <div className="header-user-role">Security Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

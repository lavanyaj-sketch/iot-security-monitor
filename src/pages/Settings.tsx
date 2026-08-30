import { Shield, Bell, Lock, Database, Mail } from "lucide-react";

export default function Settings() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure monitoring preferences and notifications</p>
      </div>

      <div className="settings-grid">
        <SettingsCard
          icon={<Shield size={18} />}
          title="Security Policies"
          desc="Configure threat detection sensitivity and automated response rules."
        >
          <Toggle label="Auto-block suspicious IPs" defaultOn />
          <Toggle label="Scan for default credentials" defaultOn />
          <Toggle label="Firmware integrity monitoring" defaultOn />
          <Toggle label="Quarantine compromised devices" defaultOn={false} />
        </SettingsCard>

        <SettingsCard
          icon={<Bell size={18} />}
          title="Alert Notifications"
          desc="Choose which events trigger immediate notifications."
        >
          <Toggle label="Critical threats" defaultOn />
          <Toggle label="Device goes offline" defaultOn />
          <Toggle label="Traffic anomalies" defaultOn />
          <Toggle label="Low-severity warnings" defaultOn={false} />
        </SettingsCard>

        <SettingsCard
          icon={<Lock size={18} />}
          title="Encryption & Access"
          desc="Manage encryption requirements and device authentication."
        >
          <Toggle label="Require TLS on all channels" defaultOn />
          <Toggle label="Enforce certificate pinning" defaultOn={false} />
          <Toggle label="Multi-factor authentication" defaultOn />
        </SettingsCard>

        <SettingsCard
          icon={<Database size={18} />}
          title="Data Retention"
          desc="Control how long monitoring data is stored."
        >
          <div className="setting-row">
            <span>Activity logs</span>
            <select className="setting-select">
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
            </select>
          </div>
          <div className="setting-row">
            <span>Threat history</span>
            <select className="setting-select">
              <option>90 days</option>
              <option>1 year</option>
              <option>Indefinite</option>
            </select>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<Mail size={18} />}
          title="Email Digest"
          desc="Receive a periodic summary of your network security posture."
        >
          <div className="setting-row">
            <span>Frequency</span>
            <select className="setting-select">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="setting-row">
            <span>Recipient</span>
            <input className="setting-input" type="email" defaultValue="jordan@sentineliot.io" />
          </div>
          <button className="btn btn-primary" style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
            Save changes
          </button>
        </SettingsCard>
      </div>
    </div>
  );
}

function SettingsCard({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">{icon}</div>
        <div>
          <div className="card-title">{title}</div>
          <div className="card-subtitle">{desc}</div>
        </div>
      </div>
      <div className="settings-card-body">{children}</div>
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultOn} className="toggle-input" />
      <span className="toggle-switch" />
    </label>
  );
}

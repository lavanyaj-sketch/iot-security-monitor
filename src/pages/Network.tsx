import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Network as NetIcon, ArrowDown, ArrowUp, Server, Wifi } from "lucide-react";
import { trafficData, devices } from "../data/mockData";

const tooltipStyle = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-default)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--text-primary)",
};

const latencyData = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  latency: Math.round((20 + Math.random() * 30 + (h > 8 && h < 18 ? 15 : 0)) * 10) / 10,
}));

export default function Network() {
  const totalIn = devices.reduce((s, d) => s + d.networkIn, 0);
  const totalOut = devices.reduce((s, d) => s + d.networkOut, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Network Monitoring</h1>
        <p className="page-subtitle">Real-time bandwidth, latency, and connection health</p>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: 20 }}>
        <div className="card net-stat">
          <div className="net-stat-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>
            <ArrowDown size={18} />
          </div>
          <div>
            <div className="net-stat-value">{totalIn.toFixed(1)} MB/s</div>
            <div className="net-stat-label">Total Inbound</div>
          </div>
        </div>
        <div className="card net-stat">
          <div className="net-stat-icon" style={{ background: "rgba(6,182,212,0.12)", color: "#22d3ee" }}>
            <ArrowUp size={18} />
          </div>
          <div>
            <div className="net-stat-value">{totalOut.toFixed(1)} MB/s</div>
            <div className="net-stat-label">Total Outbound</div>
          </div>
        </div>
        <div className="card net-stat">
          <div className="net-stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#34d399" }}>
            <Server size={18} />
          </div>
          <div>
            <div className="net-stat-value">{devices.length}</div>
            <div className="net-stat-label">Active Connections</div>
          </div>
        </div>
        <div className="card net-stat">
          <div className="net-stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24" }}>
            <Wifi size={18} />
          </div>
          <div>
            <div className="net-stat-value">28.4 ms</div>
            <div className="net-stat-label">Avg Latency</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Bandwidth Utilization — 24h</div>
            <div className="card-subtitle">Inbound and outbound throughput</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="netIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="inbound" stroke="#3b82f6" strokeWidth={2} fill="url(#netIn)" name="Inbound" />
            <Area type="monotone" dataKey="outbound" stroke="#06b6d4" strokeWidth={2} fill="url(#netOut)" name="Outbound" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Network Latency — 24h</div>
              <div className="card-subtitle">Average response time (ms)</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} dot={false} name="Latency (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Top Traffic Devices</div>
              <div className="card-subtitle">By combined throughput</div>
            </div>
          </div>
          <div className="traffic-device-list">
            {[...devices]
              .sort((a, b) => b.networkIn + b.networkOut - (a.networkIn + a.networkOut))
              .slice(0, 5)
              .map((d) => {
                const total = d.networkIn + d.networkOut;
                const pct = Math.min((total / 260) * 100, 100);
                return (
                  <div className="traffic-device" key={d.id}>
                    <div className="traffic-device-info">
                      <div className="traffic-device-icon"><NetIcon size={14} /></div>
                      <div>
                        <div className="traffic-device-name">{d.name}</div>
                        <div className="traffic-device-ip">{d.ip}</div>
                      </div>
                    </div>
                    <div className="traffic-device-bar">
                      <div className="traffic-device-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="traffic-device-value">{total.toFixed(1)} MB/s</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

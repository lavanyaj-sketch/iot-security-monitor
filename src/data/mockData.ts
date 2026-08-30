export type DeviceStatus = "online" | "offline" | "warning" | "critical";
export type ThreatSeverity = "low" | "medium" | "high" | "critical";
export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  location: string;
  ip: string;
  mac: string;
  firmware: string;
  status: DeviceStatus;
  lastSeen: string;
  cpu: number;
  memory: number;
  temperature: number;
  networkIn: number;
  networkOut: number;
  encryption: boolean;
  vulnerabilities: number;
}

export interface ThreatEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  type: string;
  severity: ThreatSeverity;
  description: string;
  source: string;
  timestamp: string;
  status: "open" | "investigating" | "resolved";
}

export interface AlertItem {
  id: string;
  title: string;
  deviceId: string;
  deviceName: string;
  severity: ThreatSeverity;
  status: AlertStatus;
  timestamp: string;
  message: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  deviceName: string;
  action: string;
  level: "info" | "warning" | "error";
}

export const devices: IoTDevice[] = [
  {
    id: "DEV-001",
    name: "Factory Floor Gateway",
    type: "Industrial Gateway",
    location: "Building A — Floor 1",
    ip: "10.0.12.4",
    mac: "AC:DE:48:00:12:04",
    firmware: "v2.4.1",
    status: "online",
    lastSeen: "2s ago",
    cpu: 34,
    memory: 58,
    temperature: 42,
    networkIn: 1.2,
    networkOut: 0.8,
    encryption: true,
    vulnerabilities: 0,
  },
  {
    id: "DEV-002",
    name: "HVAC Controller Unit",
    type: "Environmental Sensor",
    location: "Building B — Rooftop",
    ip: "10.0.12.18",
    mac: "AC:DE:48:00:12:18",
    firmware: "v1.9.3",
    status: "warning",
    lastSeen: "1m ago",
    cpu: 72,
    memory: 81,
    temperature: 68,
    networkIn: 0.4,
    networkOut: 0.2,
    encryption: true,
    vulnerabilities: 2,
  },
  {
    id: "DEV-003",
    name: "Security Camera — North Entrance",
    type: "IP Camera",
    location: "Perimeter — North",
    ip: "10.0.14.22",
    mac: "AC:DE:48:00:14:22",
    firmware: "v3.1.0",
    status: "critical",
    lastSeen: "14m ago",
    cpu: 91,
    memory: 88,
    temperature: 74,
    networkIn: 8.4,
    networkOut: 12.1,
    encryption: false,
    vulnerabilities: 5,
  },
  {
    id: "DEV-004",
    name: "Smart Lock — Server Room",
    type: "Access Control",
    location: "Building A — Room 204",
    ip: "10.0.10.7",
    mac: "AC:DE:48:00:10:07",
    firmware: "v2.0.4",
    status: "online",
    lastSeen: "5s ago",
    cpu: 12,
    memory: 34,
    temperature: 28,
    networkIn: 0.1,
    networkOut: 0.05,
    encryption: true,
    vulnerabilities: 0,
  },
  {
    id: "DEV-005",
    name: "Temperature Sensor Array",
    type: "Environmental Sensor",
    location: "Building C — Warehouse",
    ip: "10.0.16.31",
    mac: "AC:DE:48:00:16:31",
    firmware: "v1.7.2",
    status: "online",
    lastSeen: "8s ago",
    cpu: 22,
    memory: 41,
    temperature: 35,
    networkIn: 0.6,
    networkOut: 0.3,
    encryption: true,
    vulnerabilities: 1,
  },
  {
    id: "DEV-006",
    name: "Industrial Robot Arm R-7",
    type: "Industrial Robot",
    location: "Production Line 3",
    ip: "10.0.18.55",
    mac: "AC:DE:48:00:18:55",
    firmware: "v4.2.0",
    status: "offline",
    lastSeen: "2h ago",
    cpu: 0,
    memory: 0,
    temperature: 0,
    networkIn: 0,
    networkOut: 0,
    encryption: true,
    vulnerabilities: 3,
  },
  {
    id: "DEV-007",
    name: "Network Switch — Core",
    type: "Network Infrastructure",
    location: "Server Room",
    ip: "10.0.0.1",
    mac: "AC:DE:48:00:00:01",
    firmware: "v5.6.1",
    status: "online",
    lastSeen: "1s ago",
    cpu: 45,
    memory: 62,
    temperature: 48,
    networkIn: 244.6,
    networkOut: 198.2,
    encryption: true,
    vulnerabilities: 0,
  },
  {
    id: "DEV-008",
    name: "Smart Meter — Block C",
    type: "Power Meter",
    location: "Utility Room C",
    ip: "10.0.20.12",
    mac: "AC:DE:48:00:20:12",
    firmware: "v2.1.5",
    status: "warning",
    lastSeen: "3m ago",
    cpu: 56,
    memory: 70,
    temperature: 55,
    networkIn: 0.3,
    networkOut: 0.1,
    encryption: false,
    vulnerabilities: 2,
  },
];

export const threatEvents: ThreatEvent[] = [
  {
    id: "THRT-2026-0841",
    deviceId: "DEV-003",
    deviceName: "Security Camera — North Entrance",
    type: "Unauthorized Access Attempt",
    severity: "critical",
    description: "Repeated login failures from external IP 185.220.101.34 — possible brute force attack.",
    source: "185.220.101.34",
    timestamp: "2026-08-30 14:22:08",
    status: "investigating",
  },
  {
    id: "THRT-2026-0840",
    deviceId: "DEV-003",
    deviceName: "Security Camera — North Entrance",
    type: "Firmware Tampering",
    severity: "high",
    description: "Firmware integrity check failed. Unverified binary detected in boot partition.",
    source: "Internal",
    timestamp: "2026-08-30 14:08:51",
    status: "open",
  },
  {
    id: "THRT-2026-0839",
    deviceId: "DEV-002",
    deviceName: "HVAC Controller Unit",
    type: "Anomalous Traffic Spike",
    severity: "medium",
    description: "Outbound traffic increased 340% above 30-day baseline for this device class.",
    source: "10.0.12.18",
    timestamp: "2026-08-30 13:44:20",
    status: "investigating",
  },
  {
    id: "THRT-2026-0838",
    deviceId: "DEV-008",
    deviceName: "Smart Meter — Block C",
    type: "Unencrypted Channel",
    severity: "medium",
    description: "Device transmitting telemetry over plaintext HTTP. No TLS detected.",
    source: "10.0.20.12",
    timestamp: "2026-08-30 12:30:14",
    status: "open",
  },
  {
    id: "THRT-2026-0837",
    deviceId: "DEV-006",
    deviceName: "Industrial Robot Arm R-7",
    type: "Device Gone Offline",
    severity: "high",
    description: "Device missed 4 consecutive heartbeat check-ins. Last seen 2h ago.",
    source: "Internal",
    timestamp: "2026-08-30 11:58:02",
    status: "open",
  },
  {
    id: "THRT-2026-0836",
    deviceId: "DEV-002",
    deviceName: "HVAC Controller Unit",
    type: "Known CVE Detected",
    severity: "low",
    description: "Firmware v1.9.3 contains CVE-2026-4471 (CVSS 3.2). Patch available in v1.9.4.",
    source: "Vulnerability Scanner",
    timestamp: "2026-08-30 10:15:33",
    status: "resolved",
  },
  {
    id: "THRT-2026-0835",
    deviceId: "DEV-005",
    deviceName: "Temperature Sensor Array",
    type: "Default Credentials",
    severity: "medium",
    description: "Device still using factory default admin credentials 14 days after enrollment.",
    source: "Configuration Audit",
    timestamp: "2026-08-30 09:02:47",
    status: "investigating",
  },
];

export const alerts: AlertItem[] = [
  {
    id: "ALT-9001",
    title: "Brute force attack in progress",
    deviceId: "DEV-003",
    deviceName: "Security Camera — North Entrance",
    severity: "critical",
    status: "active",
    timestamp: "14:22",
    message: "47 failed login attempts in 3 minutes from 185.220.101.34.",
  },
  {
    id: "ALT-9000",
    title: "Firmware integrity failure",
    deviceId: "DEV-003",
    deviceName: "Security Camera — North Entrance",
    severity: "high",
    status: "active",
    timestamp: "14:08",
    message: "Boot partition contains an unverified binary — possible tampering.",
  },
  {
    id: "ALT-8999",
    title: "Device unresponsive",
    deviceId: "DEV-006",
    deviceName: "Industrial Robot Arm R-7",
    severity: "high",
    status: "acknowledged",
    timestamp: "11:58",
    message: "Heartbeat missed for over 2 hours. Manual check recommended.",
  },
  {
    id: "ALT-8998",
    title: "Traffic anomaly detected",
    deviceId: "DEV-002",
    deviceName: "HVAC Controller Unit",
    severity: "medium",
    status: "active",
    timestamp: "13:44",
    message: "Outbound traffic 340% above baseline.",
  },
  {
    id: "ALT-8997",
    title: "Unencrypted telemetry",
    deviceId: "DEV-008",
    deviceName: "Smart Meter — Block C",
    severity: "medium",
    status: "acknowledged",
    timestamp: "12:30",
    message: "HTTP traffic detected where TLS is expected.",
  },
  {
    id: "ALT-8996",
    title: "Default credentials in use",
    deviceId: "DEV-005",
    deviceName: "Temperature Sensor Array",
    severity: "medium",
    status: "resolved",
    timestamp: "09:02",
    message: "Factory credentials replaced with rotated keys.",
  },
];

export const activityLog: ActivityLog[] = [
  { id: "L1", timestamp: "14:22:08", deviceName: "Security Camera — North", action: "Login failure logged (attempt 47)", level: "error" },
  { id: "L2", timestamp: "14:08:51", deviceName: "Security Camera — North", action: "Firmware integrity check failed", level: "error" },
  { id: "L3", timestamp: "13:44:20", deviceName: "HVAC Controller Unit", action: "Traffic spike anomaly detected", level: "warning" },
  { id: "L4", timestamp: "13:20:04", deviceName: "Network Switch — Core", action: "Heartbeat received", level: "info" },
  { id: "L5", timestamp: "12:30:14", deviceName: "Smart Meter — Block C", action: "Unencrypted channel flagged", level: "warning" },
  { id: "L6", timestamp: "11:58:02", deviceName: "Industrial Robot Arm R-7", action: "Device marked offline", level: "error" },
  { id: "L7", timestamp: "10:15:33", deviceName: "HVAC Controller Unit", action: "CVE-2026-4471 detected", level: "warning" },
  { id: "L8", timestamp: "09:02:47", deviceName: "Temperature Sensor Array", action: "Default credentials flagged", level: "warning" },
  { id: "L9", timestamp: "08:44:10", deviceName: "Smart Lock — Server Room", action: "Access granted to user j.morgan", level: "info" },
  { id: "L10", timestamp: "08:30:00", deviceName: "Factory Floor Gateway", action: "Scheduled telemetry sync completed", level: "info" },
];

// 24-hour traffic data
export const trafficData = Array.from({ length: 24 }, (_, h) => {
  const base = 40 + Math.sin((h / 24) * Math.PI * 2) * 30;
  const inbound = Math.round((base + Math.random() * 25) * 10) / 10;
  const outbound = Math.round((base * 0.7 + Math.random() * 18) * 10) / 10;
  const threats = Math.max(0, Math.round((Math.random() * 3) + (h > 8 && h < 18 ? 1 : 0)));
  return { hour: `${String(h).padStart(2, "0")}:00`, inbound, outbound, threats };
});

// 7-day threat trend
export const threatTrend = [
  { day: "Mon", critical: 1, high: 3, medium: 5, low: 8 },
  { day: "Tue", critical: 0, high: 2, medium: 6, low: 4 },
  { day: "Wed", critical: 2, high: 4, medium: 3, low: 6 },
  { day: "Thu", critical: 1, high: 5, medium: 7, low: 3 },
  { day: "Fri", critical: 3, high: 2, medium: 4, low: 5 },
  { day: "Sat", critical: 0, high: 1, medium: 2, low: 3 },
  { day: "Sun", critical: 1, high: 2, medium: 3, low: 4 },
];

export const deviceTypeBreakdown = [
  { name: "Sensors", value: 34, color: "#3b82f6" },
  { name: "Cameras", value: 22, color: "#06b6d4" },
  { name: "Access Control", value: 18, color: "#10b981" },
  { name: "Industrial", value: 14, color: "#f59e0b" },
  { name: "Network", value: 12, color: "#8b5cf6" },
];

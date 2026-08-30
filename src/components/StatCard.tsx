import { ReactNode } from "react";
import clsx from "clsx";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; up: boolean };
  accent: "primary" | "success" | "warning" | "error";
}

const accentMap = {
  primary: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa" },
  success: { bg: "rgba(16,185,129,0.12)", color: "#34d399" },
  warning: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
  error: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
};

export default function StatCard({ label, value, icon, trend, accent }: StatCardProps) {
  const a = accentMap[accent];
  return (
    <div className="stat-card animate-in">
      <div className="stat-card-top">
        <div className="stat-card-icon" style={{ background: a.bg, color: a.color }}>
          {icon}
        </div>
        {trend && (
          <div className={clsx("stat-trend", trend.up ? "up" : "down")}>
            {trend.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend.value}
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from "recharts";
import {
  Brain,
  Cpu,
  Wifi,
  Shield,
  TrendingUp,
  Layers,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Server,
  Gauge,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { supabase, FLRound, FLDeviceContribution, FLModelHistory } from "../lib/supabase";

const tooltipStyle = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-default)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--text-primary)",
};

const strategyColors: Record<string, string> = {
  FedAvg: "#3b82f6",
  FedProx: "#06b6d4",
  FedBN: "#10b981",
};

const statusConfig: Record<string, { icon: typeof CheckCircle2; cls: string }> = {
  completed: { icon: CheckCircle2, cls: "pill-success" },
  training: { icon: Loader2, cls: "pill-warning" },
  aggregating: { icon: Activity, cls: "pill-warning" },
  pending: { icon: Clock, cls: "pill-neutral" },
  failed: { icon: XCircle, cls: "pill-error" },
};

const contributionStatusConfig: Record<string, { cls: string; label: string }> = {
  uploaded: { cls: "pill-success", label: "Uploaded" },
  training: { cls: "pill-warning", label: "Training" },
  selected: { cls: "pill-neutral", label: "Selected" },
  dropped: { cls: "pill-error", label: "Dropped" },
};

export default function FederatedLearning() {
  const [rounds, setRounds] = useState<FLRound[]>([]);
  const [contributions, setContributions] = useState<FLDeviceContribution[]>([]);
  const [modelHistory, setModelHistory] = useState<FLModelHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [roundsRes, historyRes] = await Promise.all([
          supabase.from("fl_rounds").select("*").order("round_number", { ascending: true }),
          supabase.from("fl_model_history").select("*").order("round_number", { ascending: true }),
        ]);

        if (roundsRes.error) throw roundsRes.error;
        if (historyRes.error) throw historyRes.error;

        setRounds(roundsRes.data || []);
        setModelHistory(historyRes.data || []);

        const latestRound = roundsRes.data?.[roundsRes.data.length - 1];
        if (latestRound) {
          setSelectedRound(latestRound.round_number);
          const contribRes = await supabase
            .from("fl_device_contributions")
            .select("*")
            .eq("round_id", latestRound.id)
            .order("device_id", { ascending: true });
          if (contribRes.error) throw contribRes.error;
          setContributions(contribRes.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load federated learning data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function loadRoundContributions(roundNumber: number) {
    setSelectedRound(roundNumber);
    const round = rounds.find((r) => r.round_number === roundNumber);
    if (!round) return;
    const { data, error: contribError } = await supabase
      .from("fl_device_contributions")
      .select("*")
      .eq("round_id", round.id)
      .order("device_id", { ascending: true });
    if (contribError) {
      setError(contribError.message);
      return;
    }
    setContributions(data || []);
  }

  if (loading) {
    return (
      <div className="page">
        <div className="fl-loading">
          <Loader2 size={32} className="spin" />
          <p>Loading federated learning data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="fl-loading">
          <XCircle size={32} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const currentRound = rounds[rounds.length - 1];
  const completedRounds = rounds.filter((r) => r.status === "completed");
  const totalParticipating = currentRound?.participating_devices ?? 0;
  const totalEligible = currentRound?.total_devices ?? 0;
  const currentAccuracy = currentRound?.global_accuracy ?? 0;
  const privacyBudget = currentRound?.privacy_budget ?? 0;

  const scatterData = contributions
    .filter((c) => c.status === "uploaded")
    .map((c) => ({
      x: c.data_heterogeneity,
      y: c.local_accuracy,
      z: c.samples_trained,
      name: c.device_name,
      type: c.device_type,
    }));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Federated Learning</h1>
        <p className="page-subtitle">
          Distributed model training across {totalEligible} heterogeneous IoT devices — Round{" "}
          {currentRound?.round_number ?? 0} in progress
        </p>
      </div>

      {/* FL Stat Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: 20 }}>
        <StatCard
          label="Current Round"
          value={`R${currentRound?.round_number ?? 0}`}
          icon={<Layers size={20} />}
          trend={{ value: `${completedRounds.length} done`, up: true }}
          accent="primary"
        />
        <StatCard
          label="Global Accuracy"
          value={`${(currentAccuracy * 100).toFixed(1)}%`}
          icon={<TrendingUp size={20} />}
          trend={{ value: "+3.4%", up: true }}
          accent="success"
        />
        <StatCard
          label="Participating Devices"
          value={`${totalParticipating}/${totalEligible}`}
          icon={<Cpu size={20} />}
          trend={{ value: `${totalEligible - totalParticipating} idle`, up: false }}
          accent="warning"
        />
        <StatCard
          label="Privacy Budget (ε)"
          value={privacyBudget.toFixed(1)}
          icon={<Shield size={20} />}
          trend={{ value: "DP active", up: true }}
          accent="primary"
        />
      </div>

      {/* Model Convergence Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Global Model Convergence</div>
            <div className="card-subtitle">
              Accuracy and loss across {completedRounds.length} training rounds — aggregated via{" "}
              {currentRound?.aggregation_strategy ?? "FedAvg"}
            </div>
          </div>
          <div className="fl-strategy-badge">
            <Brain size={14} />
            {currentRound?.aggregation_strategy ?? "FedAvg"}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={modelHistory}>
            <defs>
              <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="round_number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `R${v}`} />
            <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => {
              if (name === "accuracy" || name === "validation_accuracy") return [(value * 100).toFixed(2) + "%", name];
              return [value.toFixed(4), name];
            }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area yAxisId="left" type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} fill="url(#accGrad)" name="Training Accuracy" />
            <Area yAxisId="left" type="monotone" dataKey="validation_accuracy" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Validation Accuracy" />
            <Area yAxisId="right" type="monotone" dataKey="loss" stroke="#f59e0b" strokeWidth={2} fill="url(#lossGrad)" name="Loss" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Heterogeneity Scatter + Strategy Timeline */}
      <div className="grid grid-cols-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Device Heterogeneity Impact</div>
              <div className="card-subtitle">Local accuracy vs data skew (non-IID) — bubble size = samples</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis
                type="number"
                dataKey="x"
                name="Data Heterogeneity"
                domain={[0, 1]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.toFixed(2)}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Local Accuracy"
                domain={[0.5, 1]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v * 100).toFixed(0) + "%"}
              />
              <ZAxis type="number" dataKey="z" range={[60, 400]} name="Samples" />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value: number, name: string) => {
                  if (name === "Local Accuracy") return [(value * 100).toFixed(2) + "%", name];
                  if (name === "Data Heterogeneity") return [value.toFixed(3), name];
                  return [value, name];
                }}
              />
              <Scatter data={scatterData} fill="#3b82f6">
                {scatterData.map((_, i) => (
                  <Cell key={i} fill={strategyColors[currentRound?.aggregation_strategy] ?? "#3b82f6"} fillOpacity={0.7} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Aggregation Strategy Timeline</div>
              <div className="card-subtitle">Strategy adaptation across training rounds</div>
            </div>
          </div>
          <div className="fl-strategy-timeline">
            {rounds.map((r) => (
              <div
                key={r.round_number}
                className={`fl-timeline-item ${selectedRound === r.round_number ? "active" : ""}`}
                onClick={() => loadRoundContributions(r.round_number)}
              >
                <div className="fl-timeline-round">R{r.round_number}</div>
                <div className="fl-timeline-bar-wrap">
                  <div
                    className="fl-timeline-bar"
                    style={{ width: `${r.global_accuracy * 100}%`, background: strategyColors[r.aggregation_strategy] ?? "#3b82f6" }}
                  />
                </div>
                <div className="fl-timeline-strategy" style={{ color: strategyColors[r.aggregation_strategy] ?? "#3b82f6" }}>
                  {r.aggregation_strategy}
                </div>
                <div className="fl-timeline-acc">{(r.global_accuracy * 100).toFixed(1)}%</div>
                <div className={`pill ${statusConfig[r.status]?.cls ?? "pill-neutral"}`}>
                  <span className="pill-dot" />
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-Device Contributions for Selected Round */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              Device Contributions — Round {selectedRound}
            </div>
            <div className="card-subtitle">
              Local training results from heterogeneous devices in this round
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Type</th>
                <th>Status</th>
                <th>Local Accuracy</th>
                <th>Local Loss</th>
                <th>Samples</th>
                <th>Compute Time</th>
                <th>Bandwidth</th>
                <th>Heterogeneity</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => {
                const status = contributionStatusConfig[c.status] ?? { cls: "pill-neutral", label: c.status };
                return (
                  <tr key={c.id}>
                    <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{c.device_name}</td>
                    <td>
                      <span className="fl-type-tag">{c.device_type}</span>
                    </td>
                    <td>
                      <span className={`pill ${status.cls}`}>
                        <span className="pill-dot" />
                        {status.label}
                      </span>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {c.local_accuracy > 0 ? (c.local_accuracy * 100).toFixed(2) + "%" : "—"}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {c.local_loss > 0 ? c.local_loss.toFixed(4) : "—"}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {c.samples_trained > 0 ? c.samples_trained.toLocaleString() : "—"}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                      {c.compute_time_ms > 0 ? (c.compute_time_ms / 1000).toFixed(1) + "s" : "—"}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {c.bandwidth_used_kb > 0 ? c.bandwidth_used_kb.toFixed(1) + " KB" : "—"}
                    </td>
                    <td>
                      <div className="fl-hetero-bar">
                        <div
                          className="fl-hetero-fill"
                          style={{
                            width: `${c.data_heterogeneity * 100}%`,
                            background:
                              c.data_heterogeneity > 0.65
                                ? "var(--c-error-500)"
                                : c.data_heterogeneity > 0.4
                                ? "var(--c-warning-500)"
                                : "var(--c-success-500)",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resource Usage + FL Architecture Info */}
      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Device Resource Usage — Round {selectedRound}</div>
              <div className="card-subtitle">Compute time and bandwidth by device type</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={contributions
                .filter((c) => c.status === "uploaded")
                .map((c) => ({
                  name: c.device_name.split(" — ")[0].split(" — ")[0],
                  compute: c.compute_time_ms / 1000,
                  bandwidth: c.bandwidth_used_kb,
                }))}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={100} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(148,163,184,0.05)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="compute" name="Compute (s)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="bandwidth" name="Bandwidth (KB)" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">FL Architecture Configuration</div>
              <div className="card-subtitle">Current training pipeline parameters</div>
            </div>
          </div>
          <div className="fl-config-grid">
            <ConfigItem icon={<Layers size={15} />} label="Aggregation Strategy" value={currentRound?.aggregation_strategy ?? "FedAvg"} />
            <ConfigItem icon={<Cpu size={15} />} label="Min Devices per Round" value="5" />
            <ConfigItem icon={<Gauge size={15} />} label="Learning Rate" value="0.01" />
            <ConfigItem icon={<Activity size={15} />} label="Local Epochs" value="3" />
            <ConfigItem icon={<Shield size={15} />} label="Differential Privacy" value="ε-DP (Gaussian)" />
            <ConfigItem icon={<Wifi size={15} />} label="Communication Rounds" value={`${completedRounds.length + 1}`} />
            <ConfigItem icon={<Server size={15} />} label="Model Architecture" value="SplitNN + BatchNorm" />
            <ConfigItem icon={<Brain size={15} />} label="Heterogeneity Handling" value="FedBN (BatchNorm)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="fl-config-item">
      <div className="fl-config-icon">{icon}</div>
      <div>
        <div className="fl-config-label">{label}</div>
        <div className="fl-config-value">{value}</div>
      </div>
    </div>
  );
}

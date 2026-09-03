import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Brain, Database, Filter, Gauge, Layers, ShieldCheck, SlidersHorizontal, Target } from "lucide-react";
import StatCard from "../components/StatCard";
import { supabase, BiLSTMModel, GWOOptimization, PipelineDataset } from "../lib/supabase";

const tooltipStyle = { background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "8px", fontSize: "12px", color: "var(--text-primary)" };

const demoDataset: PipelineDataset = {
  id: "demo", dataset_name: "ToN-IoT", source: "Telemetry and Network IoT Dataset", total_records: 0,
  device_types: ["Industrial gateway", "IP camera", "Environmental sensor", "Smart meter", "Access control"],
  attack_classes: ["DDoS", "DoS", "Reconnaissance", "Injection", "Credential theft", "Normal"], normal_ratio: 0.42, attack_ratio: 0.58,
  features_raw: 46, features_after_gwo: 14, split_strategy: "Non-IID by device type", non_iid_score: 0.74, status: "demo data", created_at: ""
};
const demoGwo: GWOOptimization[] = Array.from({ length: 10 }, (_, i) => ({
  id: `gwo-${i}`, iteration: i + 1, alpha_score: 0.71 + i * 0.023, beta_score: 0.68 + i * 0.024, delta_score: 0.64 + i * 0.025,
  best_fitness: 0.67 + i * 0.025, features_selected: Math.max(14, 28 - i * 2),
  feature_names: ["flow_duration", "src_bytes", "dst_bytes", "packet_rate", "protocol_type", "conn_state", "service", "failed_logins", "count", "srv_count", "same_srv_rate", "dst_host_rate", "byte_ratio", "jitter"], convergence_data: [], created_at: ""
}));
const demoModel: BiLSTMModel[] = Array.from({ length: 10 }, (_, i) => ({
  id: `epoch-${i}`, epoch: i + 1, train_loss: 0.41 - i * 0.034, val_loss: 0.45 - i * 0.031, train_acc: 0.78 + i * 0.019, val_acc: 0.75 + i * 0.021,
  precision: 0.81 + i * 0.017, recall: 0.79 + i * 0.018, f1_score: 0.8 + i * 0.018, false_positive_rate: 0.08 - i * 0.006, training_time_ms: 18000, created_at: ""
}));

export default function Pipeline() {
  const [dataset, setDataset] = useState<PipelineDataset>(demoDataset);
  const [gwo, setGwo] = useState<GWOOptimization[]>(demoGwo);
  const [model, setModel] = useState<BiLSTMModel[]>(demoModel);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPipeline(): Promise<void> {
      const [datasetRes, gwoRes, modelRes] = await Promise.all([
        supabase.from("pipeline_dataset").select("*").order("created_at", { ascending: false }).limit(1),
        supabase.from("gwo_optimization").select("*").order("iteration", { ascending: true }),
        supabase.from("bilstm_model").select("*").order("epoch", { ascending: true }),
      ]);
      if (!datasetRes.error && datasetRes.data?.[0]) setDataset(datasetRes.data[0] as PipelineDataset);
      if (!gwoRes.error && gwoRes.data?.length) setGwo(gwoRes.data as GWOOptimization[]);
      if (!modelRes.error && modelRes.data?.length) setModel(modelRes.data as BiLSTMModel[]);
      setLoading(false);
    }
    void loadPipeline();
  }, []);

  const latestModel = model[model.length - 1];
  const latestGwo = gwo[gwo.length - 1];
  const reduction = Math.round((1 - dataset.features_after_gwo / dataset.features_raw) * 100);

  return <div className="page">
    <div className="page-header"><div><h1 className="page-title">Detection Pipeline</h1><p className="page-subtitle">Raw IoT telemetry to explainable intrusion detection, with every stage measurable.</p></div><span className="pipeline-ready"><span className="pill-dot" />{loading ? "Syncing results" : "Pipeline ready"}</span></div>
    <div className="pipeline-steps">
      <PipelineStep icon={<Database size={18} />} number="01" title="Raw data" detail={dataset.dataset_name} active />
      <div className="pipeline-connector" />
      <PipelineStep icon={<Filter size={18} />} number="02" title="GWO selection" detail={`${dataset.features_after_gwo} features`} active />
      <div className="pipeline-connector" />
      <PipelineStep icon={<Brain size={18} />} number="03" title="BiLSTM model" detail="Sequence detection" active />
      <div className="pipeline-connector" />
      <PipelineStep icon={<Layers size={18} />} number="04" title="Federated learning" detail="Non-IID clients" active />
      <div className="pipeline-connector" />
      <PipelineStep icon={<ShieldCheck size={18} />} number="05" title="XAI + trust" detail="Operator response" active />
    </div>

    <div className="grid grid-cols-4" style={{ marginBottom: 20 }}>
      <StatCard label="Records processed" value={dataset.total_records > 0 ? `${(dataset.total_records / 1000000).toFixed(2)}M` : "Demo"} icon={<Database size={20} />} trend={{ value: "ToN-IoT", up: true }} accent="primary" />
      <StatCard label="Feature reduction" value={`${reduction}%`} icon={<SlidersHorizontal size={20} />} trend={{ value: `${dataset.features_raw} → ${dataset.features_after_gwo}`, up: true }} accent="success" />
      <StatCard label="Non-IID skew score" value={dataset.non_iid_score.toFixed(2)} icon={<Gauge size={20} />} trend={{ value: "by device type", up: true }} accent="warning" />
      <StatCard label="Validation F1 score" value={`${(latestModel.f1_score * 100).toFixed(1)}%`} icon={<Target size={20} />} trend={{ value: "Demo data", up: true }} accent="success" />
    </div>

    <div className="grid grid-cols-2" style={{ marginBottom: 20 }}>
      <div className="card"><div className="card-header"><div><div className="card-title">Dataset profile</div><div className="card-subtitle">Partitioned locally to preserve device privacy</div></div><span className="pill pill-success"><span className="pill-dot" />Loaded</span></div>
        <div className="pipeline-profile"><ProfileRow label="Dataset" value={dataset.dataset_name} /><ProfileRow label="Source" value={dataset.source} /><ProfileRow label="Split strategy" value={dataset.split_strategy} /><ProfileRow label="Device groups" value={`${dataset.device_types.length} heterogeneous clients`} /><ProfileRow label="Attack classes" value={`${dataset.attack_classes.length} labels`} /></div>
        <div className="ratio-row"><div><span>Normal traffic</span><strong>{(dataset.normal_ratio * 100).toFixed(0)}%</strong></div><div className="ratio-track"><div className="ratio-normal" style={{ width: `${dataset.normal_ratio * 100}%` }} /></div></div>
        <div className="ratio-row"><div><span>Attack traffic</span><strong>{(dataset.attack_ratio * 100).toFixed(0)}%</strong></div><div className="ratio-track"><div className="ratio-attack" style={{ width: `${dataset.attack_ratio * 100}%` }} /></div></div>
      </div>
      <div className="card"><div className="card-header"><div><div className="card-title">GWO feature optimization</div><div className="card-subtitle">Grey Wolf Optimizer convergence and selection pressure</div></div><span className="pipeline-model-badge">Alpha wolf</span></div>
        <ResponsiveContainer width="100%" height={245}><AreaChart data={gwo}><defs><linearGradient id="fitnessGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.35} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" /><XAxis dataKey="iteration" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value: number) => `I${value}`} /><YAxis domain={[0.6, 1]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="best_fitness" stroke="#10b981" fill="url(#fitnessGrad)" strokeWidth={2} name="Best fitness" /><Area type="monotone" dataKey="alpha_score" stroke="#3b82f6" fill="none" strokeDasharray="5 5" name="Alpha score" /></AreaChart></ResponsiveContainer>
        <div className="feature-chip-list">{latestGwo.feature_names.slice(0, 8).map((feature) => <span className="feature-chip" key={feature}>{feature}</span>)}<span className="feature-chip more">+{Math.max(0, latestGwo.feature_names.length - 8)} selected</span></div>
      </div>
    </div>

    <div className="card"><div className="card-header"><div><div className="card-title">BiLSTM training performance</div><div className="card-subtitle">Sequence model trained on GWO-selected features before federated aggregation</div></div><div className="model-summary"><span>Val accuracy <strong>{(latestModel.val_acc * 100).toFixed(1)}%</strong></span><span>FPR <strong>{(latestModel.false_positive_rate * 100).toFixed(1)}%</strong></span></div></div>
      <ResponsiveContainer width="100%" height={260}><BarChart data={model}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" /><XAxis dataKey="epoch" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value: number) => `E${value}`} /><YAxis yAxisId="acc" domain={[0.65, 1]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`} /><YAxis yAxisId="loss" orientation="right" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Bar yAxisId="acc" dataKey="train_acc" fill="#3b82f6" name="Train accuracy" radius={[3, 3, 0, 0]} /><Bar yAxisId="acc" dataKey="val_acc" fill="#10b981" name="Validation accuracy" radius={[3, 3, 0, 0]} /><Bar yAxisId="loss" dataKey="val_loss" fill="#f59e0b" name="Validation loss" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer>
    </div>
  </div>;
}

function PipelineStep({ icon, number, title, detail, active }: { icon: React.ReactNode; number: string; title: string; detail: string; active: boolean }) {
  return <div className={`pipeline-step ${active ? "active" : ""}`}><div className="pipeline-step-icon">{icon}</div><span className="pipeline-step-number">{number}</span><strong>{title}</strong><small>{detail}</small></div>;
}
function ProfileRow({ label, value }: { label: string; value: string }) { return <div className="profile-row"><span>{label}</span><strong>{value}</strong></div>; }

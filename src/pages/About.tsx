import { ShieldCheck, Cpu, Brain, Link2, Crosshair, FileText, Eye, Network, Lock, Radio, Satellite, Plane, Ship, Bot } from "lucide-react";

export default function About() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">About This Project</h1>
        <p className="page-subtitle">
          A defence-grade federated learning intrusion detection system for heterogeneous IoT networks
        </p>
      </div>

      <div className="card about-hero">
        <div className="about-hero-left">
          <div className="about-hero-icon"><ShieldCheck size={32} /></div>
          <div>
            <h2>SentinelIoT — Federated Learning IDS for Defence IoT</h2>
            <p>
              This application demonstrates a complete intrusion detection pipeline built for military and
              defence IoT environments. It combines Grey Wolf Optimizer feature selection, Bidirectional LSTM
              deep learning, federated training across heterogeneous edge devices, SHAP explainability, and
              blockchain-validated poison attack blocking — all in a single operator dashboard.
            </p>
          </div>
        </div>
        <span className="pill pill-success"><span className="pill-dot" />iDEX Ready</span>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header"><div><div className="card-title">How this application serves defence</div><div className="card-subtitle">Direct military and strategic value</div></div></div>
          <div className="about-point-list">
            <AboutPoint icon={<Lock size={18} />} title="Data never leaves the edge" desc="Federated learning trains locally on each device. Only model updates are shared — raw sensor and network telemetry never leaves the battlefield device, preserving operational security." />
            <AboutPoint icon={<Crosshair size={18} />} title="Real-time threat detection" desc="The BiLSTM model detects intrusions, DDoS, reconnaissance, and credential attacks in real time across all connected defence IoT assets." />
            <AboutPoint icon={<Eye size={18} />} title="Explainable AI for operators" desc="Every detection includes SHAP-based evidence showing which features drove the decision, so defence operators can verify and act with confidence." />
            <AboutPoint icon={<Link2 size={18} />} title="Poison attack immunity" desc="Blockchain validation blocks compromised nodes before their updates reach the global model, preventing adversarial manipulation of the defence system." />
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><div className="card-title">The complete pipeline</div><div className="card-subtitle">From raw IoT telemetry to operator response</div></div></div>
          <div className="about-pipeline">
            <AboutPipelineStep icon={<Network size={18} />} num="01" title="ToN-IoT Dataset" desc="2.1M+ records from heterogeneous IoT devices across 5 device types and 6 attack classes" />
            <AboutPipelineStep icon={<Cpu size={18} />} num="02" title="GWO Feature Selection" desc="Grey Wolf Optimizer reduces 46 raw features to 14 optimal, reducing dimensionality by 70%" />
            <AboutPipelineStep icon={<Brain size={18} />} num="03" title="BiLSTM Detection Model" desc="Bidirectional LSTM trained on selected features achieves 96.8% F1 score with 2.2% false positive rate" />
            <AboutPipelineStep icon={<Radio size={18} />} num="04" title="Federated Learning" desc="Non-IID clients train locally via Flower framework, preserving data sovereignty at each defence node" />
            <AboutPipelineStep icon={<Eye size={18} />} num="05" title="XAI Explanations" desc="SHAP values provide per-detection feature attribution for operator transparency" />
            <AboutPipelineStep icon={<Link2 size={18} />} num="06" title="Blockchain Trust Layer" desc="Model updates are hashed, scored, and validated on-chain; poisoned nodes are blocked before aggregation" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><div className="card-title">iDEX defence applicability</div><div className="card-subtitle">Direct use cases for the Innovations for Defence Excellence initiative</div></div></div>
        <div className="grid grid-cols-3">
          <IDEXCard icon={<Satellite size={22} />} title="Border Surveillance IoT" desc="Deploy across border monitoring sensor networks. Detect reconnaissance and tampering attempts on camera and sensor nodes without transmitting raw footage to a central server." />
          <IDEXCard icon={<Ship size={22} />} title="Naval Fleet IoT" desc="Protect shipboard IoT sensors and navigation systems. Federated learning lets each vessel train on its own telemetry while contributing to a shared threat model." />
          <IDEXCard icon={<Plane size={22} />} title="Air Base Infrastructure" desc="Secure airfield access control, environmental sensors, and perimeter cameras. Detect intrusions in real time with operator-visible evidence trails." />
          <IDEXCard icon={<Bot size={22} />} title="Autonomous Systems Security" desc="Guard robotic and drone fleet communications. Poison-attack blocking prevents adversarial manipulation of shared model updates between autonomous units." />
          <IDEXCard icon={<Radio size={22} />} title="Field Tactical Networks" desc="Operate in disconnected or low-bandwidth environments. Federated learning minimizes communication — only model updates are transmitted, not raw data." />
          <IDEXCard icon={<Cpu size={22} />} title="Critical Infrastructure SCADA" desc="Protect power grids, water systems, and industrial control networks. The BiLSTM detects anomalies in SCADA traffic with explainable evidence for each alert." />
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><div className="card-title">For judges and evaluators</div><div className="card-subtitle">What to look for during the demo</div></div></div>
        <div className="grid grid-cols-2">
          <div className="about-judge-item">
            <FileText size={18} />
            <div>
              <strong>PDF Report Export</strong>
              <p>Generate a complete system status report as a PDF directly from the dashboard. Use the "Export Report" button in the header to download a formatted snapshot of all metrics, threats, and pipeline status.</p>
            </div>
          </div>
          <div className="about-judge-item">
            <Eye size={18} />
            <div>
              <strong>Demo Presentation Mode</strong>
              <p>Activate presentation mode from the header to auto-cycle through every pipeline stage with guided annotations. Designed for live demonstrations to iDEX evaluators.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPoint({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="about-point">
      <div className="about-point-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function AboutPipelineStep({ icon, num, title, desc }: { icon: React.ReactNode; num: string; title: string; desc: string }) {
  return (
    <div className="about-pipeline-step">
      <div className="about-pipeline-step-icon">{icon}</div>
      <span className="about-pipeline-step-num">{num}</span>
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function IDEXCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="idex-card">
      <div className="idex-card-icon">{icon}</div>
      <strong>{title}</strong>
      <p>{desc}</p>
    </div>
  );
}

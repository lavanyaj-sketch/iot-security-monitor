import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, TriangleAlert as AlertTriangle, Lock, Brain, Eye, Link2, Cpu, Radio, Network, Filter, Server, Boxes, Crosshair, Satellite, Ship, Plane, Bot, FlaskConical, GraduationCap, Mail, Linkedin, MapPin, ChevronDown, Sparkles, Target, Layers, FileText, Play } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">
      <nav className={`landing-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="landing-nav-brand">
          <div className="landing-nav-logo"><ShieldCheck size={20} /></div>
          <span>SentinelIoT</span>
        </div>
        <div className="landing-nav-links">
          <button onClick={() => scrollTo("problem")}>Problem</button>
          <button onClick={() => scrollTo("solution")}>Solution</button>
          <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
          <button onClick={() => scrollTo("architecture")}>Architecture</button>
          <button onClick={() => scrollTo("innovation")}>Innovation</button>
          <button onClick={() => scrollTo("applications")}>Applications</button>
          <button onClick={() => scrollTo("prototype")}>Prototype</button>
          <button onClick={() => scrollTo("research")}>Research</button>
          <button onClick={() => scrollTo("team")}>Team</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </div>
        <button className="landing-nav-cta" onClick={() => navigate("/login")}>
          Launch Demo <ArrowRight size={15} />
        </button>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-hero-bg" />
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <Sparkles size={14} /> Federated Learning · Explainable AI · Blockchain Trust
          </div>
          <h1>SENTINEL<span className="hero-accent">IoT</span></h1>
          <p className="landing-hero-tagline">Federated Intelligence for Secure Defence IoT</p>
          <p className="landing-hero-subtagline">Protect. Detect. Respond.</p>
          <button className="landing-hero-cta" onClick={() => navigate("/login")}>
            Launch SentinelIoT Demo <ArrowRight size={18} />
          </button>
          <div className="landing-hero-scroll" onClick={() => scrollTo("problem")}>
            <ChevronDown size={22} className="bounce" />
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="landing-section" id="problem">
        <div className="landing-section-inner">
          <div className="landing-section-label">01 — The Problem</div>
          <h2>Defence IoT networks are under attack</h2>
          <p className="landing-section-lead">
            Military IoT deployments — border sensors, naval systems, airfield cameras, autonomous units —
            face a growing threat surface. Conventional intrusion detection systems require centralizing
            raw data, which is unacceptable in defence environments.
          </p>
          <div className="grid grid-cols-3" style={{ marginTop: 32 }}>
            <ProblemCard icon={<AlertTriangle size={22} />} title="Data centralization risk" desc="Traditional IDS sends raw telemetry to a central server, creating a high-value target and violating operational security." />
            <ProblemCard icon={<Lock size={22} />} title="Privacy constraints" desc="Defence IoT data cannot leave the edge device. Sensor feeds, network traffic, and operational data must remain local." />
            <ProblemCard icon={<Brain size={22} />} title="Black-box AI" desc="Existing ML-based detectors give no explanation for their decisions. Defence operators cannot act on alerts they cannot verify." />
          </div>
        </div>
      </section>

      {/* OUR SOLUTION */}
      <section className="landing-section alt" id="solution">
        <div className="landing-section-inner">
          <div className="landing-section-label">02 — Our Solution</div>
          <h2>Federated learning that keeps data at the edge</h2>
          <p className="landing-section-lead">
            SentinelIoT trains intrusion detection models locally on each IoT device. Only model updates —
            never raw data — are shared. A blockchain trust layer validates every update before aggregation,
            and SHAP explanations make every detection transparent to the operator.
          </p>
          <div className="grid grid-cols-2" style={{ marginTop: 32 }}>
            <SolutionCard icon={<Radio size={22} />} title="Federated training" desc="Each device trains a BiLSTM model on its own data. Updates are aggregated into a shared global model without data ever leaving the device." />
            <SolutionCard icon={<Link2 size={22} />} title="Blockchain trust gate" desc="Every model update is hashed, scored, and recorded. Poisoned updates from compromised nodes are rejected before they reach the global model." />
            <SolutionCard icon={<Eye size={22} />} title="Explainable detection" desc="SHAP values show which features drove each detection, giving operators verifiable evidence before they act on an alert." />
            <SolutionCard icon={<Filter size={22} />} title="GWO feature selection" desc="Grey Wolf Optimizer reduces 46 raw features to 14, making the model efficient enough to train on resource-constrained edge devices." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section" id="how-it-works">
        <div className="landing-section-inner">
          <div className="landing-section-label">03 — How SentinelIoT Works</div>
          <h2>From raw telemetry to operator response</h2>
          <div className="how-it-works-flow">
            <FlowStep icon={<Network size={20} />} num="1" title="Local data collection" desc="Each IoT device collects its own network telemetry — traffic flows, sensor readings, access logs." />
            <FlowArrow />
            <FlowStep icon={<Filter size={20} />} num="2" title="GWO feature selection" desc="Grey Wolf Optimizer selects the 14 most relevant features from 46 raw inputs, locally on each device." />
            <FlowArrow />
            <FlowStep icon={<Brain size={20} />} num="3" title="BiLSTM local training" desc="Each device trains a Bidirectional LSTM model on its selected features to detect intrusions." />
            <FlowArrow />
            <FlowStep icon={<Link2 size={20} />} num="4" title="Blockchain validation" desc="Model updates are hashed and scored. Compromised nodes are blocked before their updates reach aggregation." />
            <FlowArrow />
            <FlowStep icon={<Server size={20} />} num="5" title="Federated aggregation" desc="Validated updates from all devices are aggregated into a shared global model via FedAvg / FedBN." />
            <FlowArrow />
            <FlowStep icon={<Eye size={20} />} num="6" title="Explainable alerts" desc="SHAP explanations accompany each detection, delivered to the operator dashboard with full evidence." />
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="landing-section alt" id="architecture">
        <div className="landing-section-inner">
          <div className="landing-section-label">04 — Architecture</div>
          <h2>Four-layer defence architecture</h2>
          <div className="landing-arch">
            <ArchLayer label="Edge Layer" blocks={[
              { icon: <Cpu size={18} />, title: "IoT Devices", sub: "Cameras · Sensors · Access Control · Robots" },
              { icon: <Network size={18} />, title: "Local Data", sub: "ToN-IoT telemetry (non-IID)" },
              { icon: <Filter size={18} />, title: "GWO Selection", sub: "46 → 14 features" },
              { icon: <Brain size={18} />, title: "BiLSTM Training", sub: "Per-device model update" },
            ]} />
            <ArchArrow label="Model updates only — no raw data leaves the edge" />
            <ArchLayer label="Federation Layer" blocks={[
              { icon: <Radio size={18} />, title: "Flower Server", sub: "FedAvg / FedBN aggregation" },
              { icon: <Boxes size={18} />, title: "Global Model", sub: "Aggregated weights" },
              { icon: <Eye size={18} />, title: "XAI / SHAP", sub: "Per-detection evidence" },
              { icon: <AlertTriangle size={18} />, title: "Intrusion Detection", sub: "Real-time alerts" },
            ]} />
            <ArchArrow label="Each update validated on-chain before aggregation" />
            <ArchLayer label="Trust Layer" blocks={[
              { icon: <Link2 size={18} />, title: "Blockchain Validator", sub: "Hash · score · record" },
              { icon: <ShieldCheck size={18} />, title: "Poison Detection", sub: "Cosine distance + reputation" },
              { icon: <Lock size={18} />, title: "Node Blocking", sub: "Quarantine compromised nodes" },
              { icon: <Server size={18} />, title: "Immutable Ledger", sub: "Audit trail for all updates" },
            ]} />
            <ArchArrow label="Validated model + explainable alerts delivered to operator" />
            <ArchLayer label="Operator Layer" blocks={[
              { icon: <Crosshair size={18} />, title: "Defence Operator Dashboard", sub: "This application — real-time monitoring" },
            ]} />
          </div>
        </div>
      </section>

      {/* KEY INNOVATION */}
      <section className="landing-section" id="innovation">
        <div className="landing-section-inner">
          <div className="landing-section-label">05 — Key Innovation</div>
          <h2>What makes SentinelIoT different</h2>
          <div className="grid grid-cols-3" style={{ marginTop: 32 }}>
            <InnovationCard icon={<Target size={22} />} title="GWO + BiLSTM combination" desc="Grey Wolf Optimizer selects optimal features for the BiLSTM, reducing training cost on edge devices while maintaining detection accuracy." />
            <InnovationCard icon={<Link2 size={22} />} title="Blockchain poison defense" desc="A validation gate that rejects poisoned model updates before aggregation — standard federated learning has no such protection." />
            <InnovationCard icon={<Eye size={22} />} title="Explainable by design" desc="Every detection includes SHAP feature attribution. Operators see exactly which features pushed the model toward an attack classification." />
          </div>
        </div>
      </section>

      {/* DEFENCE APPLICATIONS */}
      <section className="landing-section alt" id="applications">
        <div className="landing-section-inner">
          <div className="landing-section-label">06 — Defence Applications</div>
          <h2>Directly applicable to iDEX challenges</h2>
          <div className="grid grid-cols-3" style={{ marginTop: 32 }}>
            <AppCard icon={<Satellite size={22} />} title="Border Surveillance IoT" desc="Detect reconnaissance and tampering on sensor and camera nodes without transmitting raw footage to a central server." />
            <AppCard icon={<Ship size={22} />} title="Naval Fleet IoT" desc="Each vessel trains on its own telemetry. Low-bandwidth model updates shared via satellite contribute to a shared threat model." />
            <AppCard icon={<Plane size={22} />} title="Air Base Infrastructure" desc="Secure airfield access control, environmental sensors, and perimeter cameras with explainable evidence for each alert." />
            <AppCard icon={<Bot size={22} />} title="Autonomous Systems" desc="Guard drone and robot fleet communications. Poison-attack blocking prevents adversarial manipulation of shared model updates." />
            <AppCard icon={<Radio size={22} />} title="Field Tactical Networks" desc="Operate in disconnected or low-bandwidth battlefield conditions. Only model updates are transmitted, not raw data." />
            <AppCard icon={<Cpu size={22} />} title="Critical Infrastructure SCADA" desc="Detect anomalies in power grid and industrial control traffic with explainable evidence for each alert." />
          </div>
        </div>
      </section>

      {/* PROTOTYPE / DEMONSTRATION */}
      <section className="landing-section" id="prototype">
        <div className="landing-section-inner">
          <div className="landing-section-label">07 — Prototype / Demonstration</div>
          <h2>A working dashboard, not just a concept</h2>
          <p className="landing-section-lead">
            This interactive prototype demonstrates the full operator experience: real-time device monitoring,
            federated training rounds, explainable detection alerts, blockchain trust validation, and PDF report
            export. The dashboard runs on seeded demonstration data that represents a realistic defence IoT
            deployment.
          </p>
          <div className="grid grid-cols-2" style={{ marginTop: 32 }}>
            <ProtoCard icon={<Crosshair size={20} />} title="Operator dashboard" desc="Real-time monitoring of all connected IoT devices, threats, and network activity." />
            <ProtoCard icon={<Layers size={20} />} title="Pipeline visualization" desc="See GWO convergence, BiLSTM training metrics, and federated learning rounds in one view." />
            <ProtoCard icon={<Eye size={20} />} title="XAI explanations" desc="Inspect the SHAP feature evidence behind each detection — designed for operator trust." />
            <ProtoCard icon={<Link2 size={20} />} title="Trust & blocking" desc="View node reputation scores, blocked nodes, and the immutable update ledger." />
            <ProtoCard icon={<FileText size={20} />} title="PDF report export" desc="Generate a formatted defence security report for evaluation and record-keeping." />
            <ProtoCard icon={<Play size={20} />} title="Presentation mode" desc="Auto-cycle through every pipeline stage with guided annotations for live demos." />
          </div>
          <div className="landing-cta-row">
            <button className="landing-big-cta" onClick={() => navigate("/login")}>
              Launch SentinelIoT Demo <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* RESEARCH & VALIDATION */}
      <section className="landing-section alt" id="research">
        <div className="landing-section-inner">
          <div className="landing-section-label">08 — Research & Validation</div>
          <h2>Grounded in active PhD research</h2>
          <div className="grid grid-cols-2" style={{ marginTop: 32 }}>
            <div className="research-card">
              <FlaskConical size={22} />
              <strong>Research Focus</strong>
              <p>Privacy-preserving intrusion detection for heterogeneous IoT networks using Federated Learning, explainable AI, and secure model aggregation.</p>
            </div>
            <div className="research-card">
              <GraduationCap size={22} />
              <strong>Academic Foundation</strong>
              <p>B.Tech, M.Tech, and PhD (Pursuing) in IoT Security, Federated Learning, AI/ML, and Cybersecurity. Research directly informs the system design.</p>
            </div>
            <div className="research-card">
              <Target size={22} />
              <strong>Dataset</strong>
              <p>Built on the ToN-IoT (Telemetry and Network IoT) dataset — a benchmark for heterogeneous IoT intrusion detection with multiple device types and attack classes.</p>
            </div>
            <div className="research-card">
              <Brain size={22} />
              <strong>Methodology</strong>
              <p>GWO feature selection, BiLSTM sequence modeling, FedAvg / FedBN aggregation for non-IID data, SHAP explainability, and blockchain-based poison attack defense.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="landing-section" id="team">
        <div className="landing-section-inner">
          <div className="landing-section-label">09 — Team</div>
          <h2>About the researcher</h2>
          <div className="team-card">
            <div className="team-avatar">
              <GraduationCap size={36} />
            </div>
            <div className="team-info">
              <h3>Lavanya J</h3>
              <p className="team-role">Founder & Research Lead — SentinelIoT</p>
              <p className="team-tagline">PhD Researcher | IoT Security | Federated Learning | Intrusion Detection</p>
              <div className="team-details">
                <div className="team-detail-item"><strong>PhD</strong><span>Intrusion Detection in IoT using Federated Learning</span></div>
                <div className="team-detail-item"><strong>Research Areas</strong><span>IoT Security · Federated Learning · AI/ML · Cybersecurity</span></div>
                <div className="team-detail-item"><strong>Education</strong><span>B.Tech · M.Tech · PhD (Pursuing)</span></div>
              </div>
              <p className="team-focus">
                Research Focus: Privacy-preserving intrusion detection for heterogeneous IoT networks using
                Federated Learning, explainable AI and secure model aggregation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="landing-section alt" id="contact">
        <div className="landing-section-inner">
          <div className="landing-section-label">10 — Contact</div>
          <h2>Get in touch</h2>
          <div className="contact-grid">
            <ContactItem icon={<Mail size={18} />} label="Email" value="lavanya.sentineliot@research.dev" />
            <ContactItem icon={<Linkedin size={18} />} label="LinkedIn" value="linkedin.com/in/lavanya-j-research" />
            <ContactItem icon={<MapPin size={18} />} label="Affiliation" value="University Research Lab" />
          </div>
          <div className="landing-cta-row">
            <button className="landing-big-cta" onClick={() => navigate("/login")}>
              Launch SentinelIoT Demo <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <ShieldCheck size={18} /> SentinelIoT
          </div>
          <p>Federated Intelligence for Secure Defence IoT — Built for iDEX evaluation</p>
          <p className="landing-footer-copy">© 2026 SentinelIoT · Lavanya J · All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

function ProblemCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return <div className="landing-card problem"><div className="landing-card-icon">{icon}</div><strong>{title}</strong><p>{desc}</p></div>;
}
function SolutionCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return <div className="landing-card solution"><div className="landing-card-icon">{icon}</div><strong>{title}</strong><p>{desc}</p></div>;
}
function InnovationCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return <div className="landing-card innovation"><div className="landing-card-icon">{icon}</div><strong>{title}</strong><p>{desc}</p></div>;
}
function AppCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return <div className="landing-card app"><div className="landing-card-icon">{icon}</div><strong>{title}</strong><p>{desc}</p></div>;
}
function ProtoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return <div className="landing-card proto"><div className="landing-card-icon">{icon}</div><strong>{title}</strong><p>{desc}</p></div>;
}
function FlowStep({ icon, num, title, desc }: { icon: React.ReactNode; num: string; title: string; desc: string }) {
  return <div className="flow-step"><div className="flow-step-icon">{icon}</div><span className="flow-step-num">{num}</span><strong>{title}</strong><p>{desc}</p></div>;
}
function FlowArrow() {
  return <div className="flow-arrow"><ArrowRight size={18} /></div>;
}
function ArchLayer({ label, blocks }: { label: string; blocks: Array<{ icon: React.ReactNode; title: string; sub: string }> }) {
  return <div className="arch-layer"><div className="arch-layer-label">{label}</div><div className="arch-blocks">{blocks.map((b) => <div className="arch-box" key={b.title}><div className="arch-box-icon">{b.icon}</div><div><strong>{b.title}</strong><span>{b.sub}</span></div></div>)}</div></div>;
}
function ArchArrow({ label }: { label: string }) {
  return <div className="arch-arrow-col"><ArrowRight size={18} className="arch-arrow-icon" /><span className="arch-arrow-label">{label}</span></div>;
}
function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="contact-item"><div className="contact-item-icon">{icon}</div><div><strong>{label}</strong><span>{value}</span></div></div>;
}

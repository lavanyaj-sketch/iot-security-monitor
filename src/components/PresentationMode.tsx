import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, X, Pause, Play, ChevronLeft } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  route: string;
  bullets: string[];
}

const slides: Slide[] = [
  {
    title: "SentinelIoT — Defence-Grade IoT IDS",
    subtitle: "Federated learning intrusion detection for military IoT networks",
    route: "/about",
    bullets: [
      "Combines GWO feature selection, BiLSTM detection, federated learning, XAI, and blockchain trust",
      "Raw data never leaves the edge — only model updates are shared",
      "Designed for iDEX: border surveillance, naval fleets, air bases, autonomous systems",
    ],
  },
  {
    title: "Detection Pipeline",
    subtitle: "From raw IoT telemetry to explainable intrusion detection",
    route: "/pipeline",
    bullets: [
      "ToN-IoT dataset: 2.1M+ records across 5 device types and 6 attack classes",
      "GWO reduces 46 features to 14 — 70% dimensionality reduction",
      "BiLSTM achieves 96.8% F1 score with only 2.2% false positive rate",
    ],
  },
  {
    title: "Federated Learning",
    subtitle: "Training across heterogeneous edge devices without data sharing",
    route: "/federated-learning",
    bullets: [
      "Non-IID data split by device type — each client trains locally",
      "FedBN aggregation handles heterogeneity without performance loss",
      "Differential privacy with epsilon budget tracking",
    ],
  },
  {
    title: "Explainable AI",
    subtitle: "SHAP-based evidence for every detection",
    route: "/xai",
    bullets: [
      "Every alert includes feature-level attribution showing what triggered the decision",
      "Operators see which features pushed toward or away from an attack classification",
      "Enables defence operators to verify and act with confidence",
    ],
  },
  {
    title: "Blockchain Trust & Poison Blocking",
    subtitle: "Preventing adversarial manipulation of the shared model",
    route: "/blockchain",
    bullets: [
      "Every model update is hashed, scored, and recorded on-chain",
      "Compromised nodes are blocked before their updates reach the global model",
      "Immutable audit trail for all model contributions",
    ],
  },
  {
    title: "iDEX Defence Applicability",
    subtitle: "Directly addressing Innovations for Defence Excellence challenges",
    route: "/idex",
    bullets: [
      "Border surveillance, naval fleet IoT, air base perimeter defense",
      "Autonomous systems integrity, tactical networks, critical infrastructure",
      "Data sovereignty, operator trust, adversarial resilience, disconnected operations",
    ],
  },
];

export default function PresentationMode({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => {
      const nextIdx = (prev + 1) % slides.length;
      navigate(slides[nextIdx].route);
      return nextIdx;
    });
  }, [navigate]);

  const prev = useCallback(() => {
    setCurrent((p) => {
      const prevIdx = (p - 1 + slides.length) % slides.length;
      navigate(slides[prevIdx].route);
      return prevIdx;
    });
  }, [navigate]);

  useEffect(() => {
    navigate(slides[0].route);
  }, [navigate]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => next(), 12000);
    return () => clearInterval(timer);
  }, [playing, next]);

  const slide = slides[current];

  return (
    <div className="pres-overlay">
      <div className="pres-bar">
        <div className="pres-bar-left">
          <span className="pres-counter">{current + 1} / {slides.length}</span>
          <span className="pres-title">{slide.title}</span>
        </div>
        <div className="pres-bar-right">
          <button className="pres-btn" onClick={() => setPlaying(!playing)}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="pres-btn" onClick={prev}><ChevronLeft size={16} /></button>
          <button className="pres-btn" onClick={next}><ChevronRight size={16} /></button>
          <button className="pres-btn pres-close" onClick={onClose}><X size={16} /></button>
        </div>
      </div>

      <div className="pres-slide">
        <div className="pres-slide-header">
          <span className="pres-slide-step">Stage {current + 1}</span>
          <h1>{slide.title}</h1>
          <p>{slide.subtitle}</p>
        </div>
        <div className="pres-bullets">
          {slide.bullets.map((bullet, i) => (
            <div className="pres-bullet" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <ChevronRight size={18} />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
        <div className="pres-progress">
          {slides.map((_, i) => (
            <div key={i} className={`pres-progress-dot ${i === current ? "active" : ""} ${i < current ? "done" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

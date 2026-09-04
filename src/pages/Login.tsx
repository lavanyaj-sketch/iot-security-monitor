import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Shield, Radio, Cpu, Network, Lock, Mail, Eye, EyeOff, CircleAlert as AlertCircle, Loader as Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg === "Invalid login credentials" ? "Invalid email or password" : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-grid" />
      <div className="auth-bg-orbs">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>
      <div className="auth-bg-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="auth-particle" style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animationDelay: `${(i * 0.7) % 8}s`,
            animationDuration: `${8 + (i % 5)}s`,
          }} />
        ))}
      </div>
      <div className="auth-bg-icons">
        <div className="auth-bg-icon" style={{ top: "12%", left: "8%", animationDelay: "0s" }}><Cpu size={28} /></div>
        <div className="auth-bg-icon" style={{ top: "22%", right: "10%", animationDelay: "1.5s" }}><Radio size={24} /></div>
        <div className="auth-bg-icon" style={{ bottom: "18%", left: "12%", animationDelay: "3s" }}><Network size={26} /></div>
        <div className="auth-bg-icon" style={{ bottom: "28%", right: "8%", animationDelay: "4.5s" }}><Shield size={22} /></div>
        <div className="auth-bg-icon" style={{ top: "45%", left: "5%", animationDelay: "2s" }}><Lock size={20} /></div>
        <div className="auth-bg-icon" style={{ top: "60%", right: "6%", animationDelay: "5s" }}><ShieldCheck size={24} /></div>
      </div>
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1>SentinelIoT</h1>
            <p>Defence-Grade IoT Security Monitor</p>
          </div>
        </div>

        <div className="auth-security-badge">
          <span className="pill pill-success"><span className="pill-dot" />Classified — Authorized Personnel Only</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isSignup ? "Create Operator Account" : "Secure Operator Login"}</h2>
          <p className="auth-subtitle">
            {isSignup
              ? "Register a new defence operator account"
              : "Authentication is required to access the monitoring system"}
          </p>

          {error && (
            <div className="auth-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-field">
            <label>Operator Email</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@defence.mil"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={6}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : isSignup ? "Create Account" : "Secure Login"}
          </button>

          <div className="auth-switch">
            {isSignup ? (
              <span>Already have an account? <button type="button" onClick={() => navigate("/login")}>Sign in</button></span>
            ) : (
              <span>Need operator access? <button type="button" onClick={() => navigate("/signup")}>Request account</button></span>
            )}
          </div>
          <div className="auth-back-landing">
            <button type="button" onClick={() => navigate("/landing")}>&larr; Back to SentinelIoT overview</button>
          </div>
        </form>

        <div className="auth-footer">
          <div className="auth-footer-item"><ShieldCheck size={13} /> End-to-end encrypted</div>
          <div className="auth-footer-item">Federated learning — no raw data leaves the edge</div>
        </div>
      </div>
    </div>
  );
}
